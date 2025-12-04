```java
package humor;

public class HumorPolicy {

    private final int maxJokeLength = 500; // Characters
    private final int maxSetupLength = 200; // Characters
    private final String[] forbiddenTopics = {
            "hate speech", "discrimination", "violence", "incitement", "illegal activities"
    };

    public boolean isJokeSafe(String setup, String punchline) {
        if (setup == null || punchline == null) {
            return false;
        }

        if (setup.length() > maxSetupLength) {
            return false;
        }

        if (punchline.length() > maxJokeLength) {
            return false;
        }

        if (containsForbiddenTopic(setup) || containsForbiddenTopic(punchline)) {
            return false;
        }

        return true;
    }

    private boolean containsForbiddenTopic(String text) {
        if (text == null) {
            return false;
        }
        text = text.toLowerCase();
        for (String topic : forbiddenTopics) {
            if (text.contains(topic)) {
                return true;
            }
        }
        return false;
    }

    public int getMaxJokeLength() {
        return maxJokeLength;
    }

    public int getMaxSetupLength() {
        return maxSetupLength;
    }

    public String[] getForbiddenTopics() {
        return forbiddenTopics;
    }
}
```