/**
 * This is an example for making a http GET /trv request to the server
 * 
 * Documentation sources:
 *
 * https://docs.oracle.com/javase/7/docs/api/java/net/HttpURLConnection.html
 * 
 */

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpExample {

    private final String GATEWAY_URL = "http://localhost:3002/api/v1";

    public static void main(String[] args) {
        HttpExample http = new HttpExample();
        try {
            http.getRequest();
        } catch (Exception ex) {
            System.out.println(ex);
        }
    }

    public void getRequest() throws Exception {
        URL url = new URL(GATEWAY_URL + "/trv");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // HttpURLConnection defaults to GET but might as well set it
        connection.setRequestMethod("GET");

        System.out.println("Making request to: " + url);

        int responseCode = connection.getResponseCode();
        String responseMessage = connection.getResponseMessage();

        System.out.println("Request recieved the following response code: " + responseCode);

        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            String result = response.toString();

            // Print result in string format
            System.out.println(result);
        } else {
            System.out.println("Got an unexpected response code from the server: " + responseCode);
            System.out.println("Got the response message: " + responseMessage);
        }
    }
}