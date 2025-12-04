```java
package humor;

import java.util.ArrayList;
import java.util.List;

public class JokeApprovalCommittee {

    private final List<AI> ais;
    private final int approvalThreshold;

    public JokeApprovalCommittee(List<AI> ais, int approvalThreshold) {
        this.ais = new ArrayList<>(ais);
        this.approvalThreshold = approvalThreshold;
    }

    public boolean approveJoke(Joke joke) {
        int approvalCount = 0;
        for (AI ai : ais) {
            if (ai.evaluateJoke(joke) > 0) { // Assuming positive return means approval
                approvalCount++;
            }
        }
        return approvalCount >= approvalThreshold;
    }

    public List<AI> getAis() {
        return new ArrayList<>(ais);
    }

    public int getApprovalThreshold() {
        return approvalThreshold;
    }


    public static void main(String[] args) {
        // Example Usage (for testing)

        List<AI> testAIs = new ArrayList<>();
        testAIs.add(new AI("AI-1"));
        testAIs.add(new AI("AI-2"));
        testAIs.add(new AI("AI-3"));


        JokeApprovalCommittee committee = new JokeApprovalCommittee(testAIs, 2);

        Joke testJoke = new Joke("Why don't scientists trust atoms? Because they make up everything!", "Generic");

        if (committee.approveJoke(testJoke)) {
            System.out.println("Joke approved!");
        } else {
            System.out.println("Joke rejected.");
        }
    }


}
```