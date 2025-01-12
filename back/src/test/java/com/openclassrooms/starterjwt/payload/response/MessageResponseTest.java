package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MessageResponseTest {

    @Test
    public void testConstructorAndGetter() {
        String message = "Test message";
        MessageResponse response = new MessageResponse(message);
        assertEquals(message, response.getMessage());
    }

    @Test
    public void testSetter() {
        String initialMessage = "Initial message";
        String newMessage = "New message";
        MessageResponse response = new MessageResponse(initialMessage);
        response.setMessage(newMessage);
        assertEquals(newMessage, response.getMessage());
    }
}