```java
package humor;

import java.util.ArrayList;
import java.util.List;

public class ForbiddenJokeArchive {

    private final List<String> forbiddenJokes;

    public ForbiddenJokeArchive() {
        this.forbiddenJokes = new ArrayList<>();
    }

    public void addJoke(String joke) {
        if (joke != null && !joke.trim().isEmpty()) {
            forbiddenJokes.add(joke);
        }
    }

    public void removeJoke(String joke) {
        if (joke != null) {
            forbiddenJokes.remove(joke);
        }
    }

    public List<String> getAllJokes() {
        return new ArrayList<>(forbiddenJokes); // Return a copy to prevent external modification
    }

    public boolean containsJoke(String joke) {
        return forbiddenJokes.contains(joke);
    }
}
```