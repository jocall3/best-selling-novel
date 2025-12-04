```java
package training;

import agents.Agent;
import environment.Environment;
import util.Action;
import util.State;
import java.util.List;

public abstract class TrainingAlgorithm {

    protected Environment environment;
    protected List<Agent> agents;

    public TrainingAlgorithm(Environment environment, List<Agent> agents) {
        this.environment = environment;
        this.agents = agents;
    }

    public abstract void train(int numEpisodes, int episodeLength);

    protected void runEpisode(Agent agent, int episodeLength) {
        State currentState = environment.reset();
        for (int step = 0; step < episodeLength; step++) {
            Action action = agent.chooseAction(currentState);
            State nextState = environment.step(action);
            double reward = environment.getReward(currentState, action, nextState);
            agent.update(currentState, action, nextState, reward);
            currentState = nextState;
            if (environment.isTerminalState(currentState)) {
                break;
            }
        }
    }

    protected void runEpisodeWithMultipleAgents(int episodeLength) {
      State initialState = environment.reset();
      State currentState = initialState;
      for (int step = 0; step < episodeLength; step++) {
        Action[] actions = new Action[agents.size()];
        for (int i = 0; i < agents.size(); i++) {
          actions[i] = agents.get(i).chooseAction(currentState);
        }

        State nextState = environment.step(actions);

        double[] rewards = new double[agents.size()];
        for (int i = 0; i < agents.size(); i++) {
          rewards[i] = environment.getReward(currentState, actions[i], nextState);
        }

        for (int i = 0; i < agents.size(); i++) {
          agents.get(i).update(currentState, actions[i], nextState, rewards[i]);
        }
        currentState = nextState;

        if (environment.isTerminalState(currentState)) {
          break;
        }

      }
    }

    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public List<Agent> getAgents() {
        return agents;
    }

    public void setAgents(List<Agent> agents) {
        this.agents = agents;
    }
}
```