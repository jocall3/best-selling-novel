```java
package training;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DataIngestionPipeline {

    private final String rawDataDirectory;
    private final String processedDataDirectory;

    public DataIngestionPipeline(String rawDataDirectory, String processedDataDirectory) {
        this.rawDataDirectory = rawDataDirectory;
        this.processedDataDirectory = processedDataDirectory;
    }

    public void ingestData() throws IOException {
        createDirectories();
        List<String> filePaths = listFiles(rawDataDirectory);

        for (String filePath : filePaths) {
            processFile(filePath);
        }
    }

    private void createDirectories() throws IOException {
        Path rawDataPath = Paths.get(rawDataDirectory);
        Path processedDataPath = Paths.get(processedDataDirectory);

        if (!Files.exists(rawDataPath)) {
            Files.createDirectories(rawDataPath);
        }
        if (!Files.exists(processedDataPath)) {
            Files.createDirectories(processedDataPath);
        }
    }


    private List<String> listFiles(String directory) throws IOException {
        try (Stream<Path> stream = Files.list(Paths.get(directory))) {
            return stream
                    .filter(Files::isRegularFile)
                    .map(Path::toAbsolutePath)
                    .map(Path::toString)
                    .collect(Collectors.toList());
        }
    }


    private void processFile(String filePath) throws IOException {
        String fileName = new File(filePath).getName();
        String outputFilePath = processedDataDirectory + File.separator + "processed_" + fileName;

        // Simulate data processing - read content, add a prefix, and write to output
        List<String> lines = Files.readAllLines(Paths.get(filePath));
        List<String> processedLines = lines.stream()
                .map(line -> "PROCESSED: " + line)
                .collect(Collectors.toList());

        Files.write(Paths.get(outputFilePath), processedLines);

        System.out.println("Processed: " + filePath + " -> " + outputFilePath);
    }



    public static void main(String[] args) {
        String rawDataDir = "data/raw";
        String processedDataDir = "data/processed";

        // Create example data if it doesn't exist
        try {
            Path rawDataPath = Paths.get(rawDataDir);
            if (!Files.exists(rawDataPath)) {
                Files.createDirectories(rawDataPath);
                Files.write(Paths.get(rawDataDir + "/example.txt"), List.of("This is a sample line.", "Another sample line."));
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Error creating example data: " + e.getMessage());
            return;
        }


        DataIngestionPipeline pipeline = new DataIngestionPipeline(rawDataDir, processedDataDir);
        try {
            pipeline.ingestData();
            System.out.println("Data ingestion complete.");
        } catch (IOException e) {
            System.err.println("Error during data ingestion: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```