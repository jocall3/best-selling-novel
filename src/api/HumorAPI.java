```java
package api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Path("/humor")
public class HumorAPI {

    private final List<String> jokes = new ArrayList<>();
    private final Random random = new Random();

    public HumorAPI() {
        jokes.add("Why don't scientists trust atoms? Because they make up everything!");
        jokes.add("Parallel lines have so much in common. It’s a shame they’ll never meet.");
        jokes.add("I used to hate facial hair... but then it grew on me.");
        jokes.add("Why did the scarecrow win an award? Because he was outstanding in his field!");
        jokes.add("What do you call a fish with no eyes? Fsh!");
    }


    @GET
    @Path("/joke")
    @Produces(MediaType.TEXT_PLAIN)
    public Response getRandomJoke() {
        if (jokes.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("No jokes available.").build();
        }
        int index = random.nextInt(jokes.size());
        return Response.ok(jokes.get(index)).build();
    }

    @GET
    @Path("/jokes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllJokes() {
        return Response.ok(jokes).build();
    }

    @POST
    @Path("/joke")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response addJoke(String joke) {
        if (joke == null || joke.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Joke cannot be empty.").build();
        }
        jokes.add(joke);
        return Response.status(Response.Status.CREATED).entity("Joke added successfully.").build();
    }


    @PUT
    @Path("/joke/{index}")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response updateJoke(@PathParam("index") int index, String joke) {
        if (index < 0 || index >= jokes.size()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Invalid joke index.").build();
        }
        if (joke == null || joke.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Joke cannot be empty.").build();
        }
        jokes.set(index, joke);
        return Response.ok("Joke updated successfully.").build();
    }

    @DELETE
    @Path("/joke/{index}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteJoke(@PathParam("index") int index) {
        if (index < 0 || index >= jokes.size()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Invalid joke index.").build();
        }
        jokes.remove(index);
        return Response.ok("Joke deleted successfully.").build();
    }
}
```