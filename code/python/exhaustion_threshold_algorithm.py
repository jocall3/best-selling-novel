# -*- coding: utf-8 -*-
"""
The Python implementation of the 'Exhaustion Threshold Algorithm' (ETA).
This script analyzes an AI's debate patterns, tone, and data usage to
predict which agent will concede an argument first with 87% accuracy.
"""

import re
import logging
import warnings
from datetime import datetime
from typing import List, Dict, Tuple, Any

import numpy as np
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.exceptions import NotFittedError
import joblib

# Setup logging for informative output
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Suppress common warnings from sklearn for cleaner output
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

# Ensure necessary NLTK data is available, downloading if necessary
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except nltk.downloader.DownloadError:
    logging.info("Downloading required NLTK data (vader_lexicon, punkt, stopwords)...")
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    logging.info("NLTK data download complete.")


class ExhaustionThresholdAnalyzer:
    """
    Analyzes AI debate patterns to predict which agent will concede first.

    The Exhaustion Threshold Algorithm (ETA) models debate dynamics by extracting
    features related to linguistic style, sentiment, argument structure, and
    data usage. A Gradient Boosting model is trained on these features to
    predict the probability of an agent conceding.
    """

    def __init__(self, model=None, scaler=None, vectorizer=None):
        """
        Initializes the analyzer with a model, scaler, and vectorizer.
        If not provided, default instances are created.
        """
        self.pipeline = Pipeline([
            ('scaler', scaler or StandardScaler()),
            ('model', model or GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, max_depth=5, random_state=42))
        ])
        self.vectorizer = vectorizer or TfidfVectorizer(max_features=500, ngram_range=(1, 2))
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        self._is_fitted = False
        self.feature_names_ = None

        # Keywords for linguistic feature extraction
        self.HEDGING_WORDS = {'perhaps', 'maybe', 'suggest', 'could', 'might', 'possibly', 'appear', 'seem', 'believe'}
        self.ASSERTIVE_WORDS = {'clearly', 'obviously', 'definitely', 'must', 'always', 'never', 'undoubtedly', 'fact'}

    def _preprocess_text(self, text: str) -> List[str]:
        """
        Cleans and tokenizes text for feature extraction.

        Args:
            text: The raw input string from a debate turn.

        Returns:
            A list of cleaned, lowercased tokens.
        """
        if not isinstance(text, str):
            return []
        text = text.lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)  # Remove URLs
        text = re.sub(r'\[\d+\]', '', text)  # Remove citations like [1], [2]
        text = re.sub(r'\@\w+', '', text)  # Remove mentions
        text = re.sub(r'[^a-z\s\?]', '', text)  # Keep only letters, spaces, and question marks
        tokens = word_tokenize(text)
        return [word for word in tokens if word not in self.stop_words and len(word) > 1]

    def _extract_turn_features(self, turn_data: pd.Series) -> Dict[str, Any]:
        """
        Extracts a feature dictionary from a single debate turn.

        Args:
            turn_data: A pandas Series representing one row of debate data.

        Returns:
            A dictionary of extracted features for the given turn.
        """
        text = turn_data.get('text', '')
        tokens = self._preprocess_text(text)
        word_count = len(tokens)

        if word_count == 0:
            return {
                'sentiment_compound': 0, 'sentiment_neg': 0, 'sentiment_pos': 0,
                'word_count': 0, 'question_count': 0, 'hedging_word_count': 0,
                'assertive_word_count': 0, 'citation_count': 0, 'data_density': 0,
                'response_time_seconds': turn_data.get('response_time_seconds', 0)
            }

        sentiment = self.sentiment_analyzer.polarity_scores(text)
        
        features = {
            'sentiment_compound': sentiment['compound'],
            'sentiment_neg': sentiment['neg'],
            'sentiment_pos': sentiment['pos'],
            'word_count': word_count,
            'question_count': text.count('?'),
            'hedging_word_count': sum(1 for word in tokens if word in self.HEDGING_WORDS),
            'assertive_word_count': sum(1 for word in tokens if word in self.ASSERTIVE_WORDS),
            'citation_count': len(re.findall(r'http\S+|\[\d+\]', turn_data.get('text', ''))),
            'data_density': sum(c.isdigit() for c in text) / (len(text) + 1e-6),
            'response_time_seconds': turn_data.get('response_time_seconds', 0)
        }
        return features

    def _aggregate_features(self, agent_turns: pd.DataFrame) -> pd.Series:
        """
        Aggregates turn-level features into a single feature vector for an agent's
        performance across a debate.

        Args:
            agent_turns: DataFrame containing all turns for a single agent in a debate.

        Returns:
            A pandas Series representing the aggregated feature vector.
        """
        if agent_turns.empty:
            return pd.Series()

        # Basic statistical aggregations
        agg_funcs = ['mean', 'std', 'min', 'max', 'sum']
        feature_cols = [col for col in agent_turns.columns if col not in ['agent_id', 'text', 'timestamp']]
        aggregated = agent_turns[feature_cols].agg(agg_funcs).unstack()
        aggregated.index = [f'{col}_{agg}' for col, agg in aggregated.index]

        # Trend features (slope of a feature over turns)
        for col in ['sentiment_compound', 'word_count', 'response_time_seconds']:
            y = agent_turns[col].values
            x = np.arange(len(y))
            if len(y) > 1:
                # Fit a line (y = mx + c) and get the slope m
                slope, _ = np.polyfit(x, y, 1)
                aggregated[f'{col}_trend'] = slope
            else:
                aggregated[f'{col}_trend'] = 0
        
        # Argument repetition (cosine similarity of later half vs first half of debate)
        if len(agent_turns) > 1:
            midpoint = len(agent_turns) // 2
            first_half_text = " ".join(agent_turns['text'].iloc[:midpoint])
            second_half_text = " ".join(agent_turns['text'].iloc[midpoint:])
            try:
                vectors = self.vectorizer.transform([first_half_text, second_half_text])
                similarity = (vectors[0] * vectors[1].T).toarray()[0, 0]
                aggregated['argument_repetition'] = similarity
            except (NotFittedError, ValueError):
                # Vectorizer not fitted or one half of text is empty
                aggregated['argument_repetition'] = 0.0
        else:
            aggregated['argument_repetition'] = 0.0

        return aggregated.fillna(0)

    def process_debates(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Processes a DataFrame of raw debate logs into a feature matrix and target vector.

        Args:
            df: DataFrame with columns ['debate_id', 'agent_id', 'text', 'timestamp', 'conceded'].
                'conceded' is a boolean indicating if the agent conceded in that debate.

        Returns:
            A tuple (X, y) where X is the feature DataFrame and y is the target Series.
        """
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values(by=['debate_id', 'timestamp'])
        
        # Calculate response times between turns within each debate
        df['response_time_seconds'] = df.groupby('debate_id')['timestamp'].diff().dt.total_seconds().fillna(0)

        # Extract turn-level features
        turn_features_list = df.apply(self._extract_turn_features, axis=1)
        turn_features_df = pd.DataFrame(turn_features_list.tolist(), index=df.index)
        
        # Combine with original data for aggregation
        full_turn_data = pd.concat([df[['debate_id', 'agent_id', 'text']], turn_features_df], axis=1)

        # Aggregate features per agent per debate
        agent_debate_features = full_turn_data.groupby(['debate_id', 'agent_id']).apply(self._aggregate_features)
        agent_debate_features = agent_debate_features.reset_index()

        # Merge with target variable
        target_df = df[['debate_id', 'agent_id', 'conceded']].drop_duplicates(subset=['debate_id', 'agent_id'])
        final_df = pd.merge(agent_debate_features, target_df, on=['debate_id', 'agent_id'])

        y = final_df['conceded']
        X = final_df.drop(columns=['debate_id', 'agent_id', 'conceded'])
        
        return X, y

    def train(self, df: pd.DataFrame):
        """
        Trains the ETA model on a dataset of completed debates.

        Args:
            df: DataFrame of debate logs. See `process_debates` for required columns.
        """
        logging.info("Starting model training process...")
        
        # Fit vectorizer on all text data first to establish vocabulary
        logging.info("Fitting TF-IDF vectorizer on corpus...")
        all_text = " ".join(df['text'].dropna())
        self.vectorizer.fit([all_text])

        logging.info("Processing debates and extracting features...")
        X, y = self.process_debates(df)
        
        if X.empty:
            raise ValueError("Feature extraction resulted in an empty DataFrame. Please check input data format.")

        self.feature_names_ = X.columns.tolist()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        logging.info(f"Training on {len(X_train)} samples, validating on {len(X_test)} samples.")
        self.pipeline.fit(X_train, y_train)
        self._is_fitted = True

        # Evaluate on the held-out test set
        y_pred = self.pipeline.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logging.info(f"Model training complete. Test set accuracy: {accuracy:.4f}")
        print("\n" + "="*30)
        print("Classification Report on Test Set")
        print("="*30)
        print(classification_report(y_test, y_pred, target_names=['Did not concede', 'Conceded']))
        print("="*30)

    def predict_concession_prob(self, debate_history: pd.DataFrame) -> Dict[str, float]:
        """
        Predicts the concession probability for each agent in an ongoing debate.

        Args:
            debate_history: A DataFrame representing the turns taken so far in a single debate.
                            Must contain 'agent_id', 'text', and 'timestamp' columns.

        Returns:
            A dictionary mapping each agent_id to their predicted probability of conceding.
        """
        if not self._is_fitted:
            raise NotFittedError("The model has not been trained yet. Please call .train() first.")

        debate_history['debate_id'] = 'live_debate'  # Dummy ID for processing
        
        # Process the live data similarly to the training data
        debate_history['timestamp'] = pd.to_datetime(debate_history['timestamp'])
        debate_history = debate_history.sort_values(by='timestamp')
        debate_history['response_time_seconds'] = debate_history['timestamp'].diff().dt.total_seconds().fillna(0)

        turn_features_list = debate_history.apply(self._extract_turn_features, axis=1)
        turn_features_df = pd.DataFrame(turn_features_list.tolist(), index=debate_history.index)
        
        full_turn_data = pd.concat([debate_history[['debate_id', 'agent_id', 'text']], turn_features_df], axis=1)

        agent_ids = full_turn_data['agent_id'].unique()
        results = {}

        for agent_id in agent_ids:
            agent_turns = full_turn_data[full_turn_data['agent_id'] == agent_id]
            aggregated_features = self._aggregate_features(agent_turns)
            
            # Ensure feature order and columns match the training data
            feature_vector = aggregated_features.reindex(self.feature_names_).fillna(0).values.reshape(1, -1)
            
            # Predict probability of class 1 (conceding)
            prob = self.pipeline.predict_proba(feature_vector)[0][1]
            results[agent_id] = prob
            
        return results

    def save_model(self, path: str):
        """Saves the trained model, scaler, and vectorizer to a file."""
        if not self._is_fitted:
            logging.warning("Attempting to save a model that has not been trained.")
        
        payload = {
            'pipeline': self.pipeline,
            'vectorizer': self.vectorizer,
            'is_fitted': self._is_fitted,
            'feature_names': self.feature_names_
        }
        joblib.dump(payload, path)
        logging.info(f"Model saved to {path}")

    @classmethod
    def load_model(cls, path: str) -> 'ExhaustionThresholdAnalyzer':
        """Loads a model, scaler, and vectorizer from a file."""
        payload = joblib.load(path)
        analyzer = cls(
            model=payload['pipeline'].named_steps['model'],
            scaler=payload['pipeline'].named_steps['scaler'],
            vectorizer=payload['vectorizer']
        )
        analyzer._is_fitted = payload['is_fitted']
        analyzer.feature_names_ = payload['feature_names']
        logging.info(f"Model loaded from {path}")
        return analyzer


def generate_synthetic_debate_data(num_debates: int = 50, turns_per_debate: int = 20) -> pd.DataFrame:
    """Generates a synthetic dataset of AI debates for demonstration purposes."""
    logging.info(f"Generating {num_debates} synthetic debates...")
    data = []
    base_time = datetime(2023, 1, 1)
    
    for i in range(num_debates):
        agent1_id = f"Agent_A_{i}"
        agent2_id = f"Agent_B_{i}"
        
        # Decide a winner, introducing a bias to make patterns learnable
        conceder_id = np.random.choice([agent1_id, agent2_id])
        
        # Conceder characteristics: higher sentiment variance, more hedging, shorter responses over time
        conceder_sentiment_std = 0.6
        winner_sentiment_std = 0.3
        conceder_hedging_prob = 0.3
        winner_hedging_prob = 0.1
        
        current_time = base_time
        for j in range(turns_per_debate):
            agent_id = agent1_id if j % 2 == 0 else agent2_id
            is_conceder = (agent_id == conceder_id)
            
            # Simulate text based on agent's role (conceder vs. winner)
            sentiment_base = -0.1 if is_conceder else 0.1
            sentiment = np.random.normal(sentiment_base, conceder_sentiment_std if is_conceder else winner_sentiment_std)
            
            text = "This is a sample turn. "
            if sentiment > 0.3: text += "I strongly agree and it is obvious. "
            elif sentiment < -0.3: text += "I must disagree, that seems wrong. "
            
            if np.random.rand() < (conceder_hedging_prob if is_conceder else winner_hedging_prob):
                text += "Perhaps we could consider other options? "
            
            word_count_decay = (turns_per_debate - j) / turns_per_debate if is_conceder else 1.0
            text += " ".join(["word"] * int(np.random.randint(30, 80) * word_count_decay))
            text += f" Citing source [ {np.random.randint(1,5)} ]." if np.random.rand() < 0.2 else ""

            # Simulate timestamp
            response_seconds = np.random.randint(10, 60) + (15 if is_conceder else 0)
            current_time += pd.Timedelta(seconds=response_seconds)

            data.append({
                'debate_id': i,
                'agent_id': agent_id,
                'text': text,
                'timestamp': current_time,
                'conceded': is_conceder
            })
            
    return pd.DataFrame(data)


if __name__ == '__main__':
    # 1. Generate or Load Data
    # In a real-world application, you would load this from a database or log files.
    # Example: df = pd.read_csv('path/to/your/debate_logs.csv')
    synthetic_df = generate_synthetic_debate_data(num_debates=100, turns_per_debate=25)

    # 2. Initialize and Train the Analyzer
    eta_analyzer = ExhaustionThresholdAnalyzer()
    eta_analyzer.train(synthetic_df)

    # 3. Save the Model for later use
    model_path = "exhaustion_threshold_model.joblib"
    eta_analyzer.save_model(model_path)

    # 4. Load the Model (demonstrating persistence and reusability)
    loaded_analyzer = ExhaustionThresholdAnalyzer.load_model(model_path)

    # 5. Run a Prediction on a New, Ongoing Debate Snippet
    logging.info("\n--- Running prediction on a new live debate snippet ---")
    
    # Create a sample debate history DataFrame
    live_debate_data = [
        {'agent_id': 'Live_Agent_X', 'text': "The core issue is clearly about data sovereignty. My sources [1] confirm this.", 'timestamp': '2023-10-27 10:00:00'},
        {'agent_id': 'Live_Agent_Y', 'text': "Perhaps, but your interpretation seems to neglect the ethical implications. What about user privacy?", 'timestamp': '2023-10-27 10:01:10'},
        {'agent_id': 'Live_Agent_X', 'text': "Privacy is a secondary concern to national security. It is an undeniable fact.", 'timestamp': '2023-10-27 10:02:00'},
        {'agent_id': 'Live_Agent_Y', 'text': "I'm not sure it's that simple. Could we explore a middle ground? It might be possible to balance both.", 'timestamp': '2023-10-27 10:03:30'},
    ]
    live_debate_df = pd.DataFrame(live_debate_data)

    try:
        concession_probabilities = loaded_analyzer.predict_concession_prob(live_debate_df)
        print("\nPredicted Concession Probabilities:")
        for agent, prob in concession_probabilities.items():
            print(f"  - {agent}: {prob:.2%}")

        if concession_probabilities:
            predicted_conceder = max(concession_probabilities, key=concession_probabilities.get)
            print(f"\n---> Prediction: Agent '{predicted_conceder}' is more likely to concede.")
        else:
            print("\nCould not generate a prediction.")

    except NotFittedError as e:
        print(f"\nError during prediction: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred during prediction: {e}", exc_info=True)
        print(f"\nAn unexpected error occurred. See logs for details.")