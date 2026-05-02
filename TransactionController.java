package com.example.tradereporter.controller;

import com.example.tradereporter.dto.TransactionDTO;
import com.example.tradereporter.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction API", description = "Endpoints for managing trade transactions")
public class TransactionController {
    private final TransactionService service;

    @PostMapping
    @Operation(summary = "Submit a new trade transaction")
    public ResponseEntity<TransactionDTO> submitTransaction(@Valid @RequestBody TransactionDTO dto) {
        return new ResponseEntity<>(service.saveTransaction(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List all transactions or filter by status")
    public ResponseEntity<List<TransactionDTO>> listTransactions(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(service.getAllTransactions(status));
    }

    @GetMapping("/report")
    @Operation(summary = "Get a report of transactions within a date range")
    public ResponseEntity<List<TransactionDTO>> getReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(service.getReport(from, to));
    }
}
