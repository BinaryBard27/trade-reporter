package com.example.tradereporter;

import com.example.tradereporter.dto.TransactionDTO;
import com.example.tradereporter.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSubmitTransaction() throws Exception {
        TransactionDTO dto = TransactionDTO.builder()
                .tradeId("T123")
                .instrumentType("STOCK")
                .amount(new BigDecimal("1000.00"))
                .currency("USD")
                .status("PENDING")
                .tradeDate(LocalDate.now())
                .build();

        when(service.saveTransaction(any(TransactionDTO.class))).thenReturn(dto);

        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tradeId").value("T123"));
    }

    @Test
    public void testListTransactions() throws Exception {
        when(service.getAllTransactions(null)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetReport() throws Exception {
        when(service.getReport(any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/transactions/report")
                .param("from", "2024-01-01")
                .param("to", "2024-12-31"))
                .andExpect(status().isOk());
    }

    @Test
    public void testValidationFailure() throws Exception {
        TransactionDTO invalidDto = TransactionDTO.builder()
                .tradeId("") // Blank
                .amount(new BigDecimal("-10.00")) // Negative
                .build();

        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
}
