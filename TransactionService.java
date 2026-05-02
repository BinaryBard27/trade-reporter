package com.example.tradereporter.service;

import com.example.tradereporter.dto.TransactionDTO;
import com.example.tradereporter.model.Transaction;
import com.example.tradereporter.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository repository;

    @Transactional
    public TransactionDTO saveTransaction(TransactionDTO dto) {
        Transaction transaction = Transaction.builder()
                .tradeId(dto.getTradeId())
                .instrumentType(dto.getInstrumentType())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .status(dto.getStatus())
                .tradeDate(dto.getTradeDate())
                .build();
        
        Transaction saved = repository.save(transaction);
        return mapToDTO(saved);
    }

    public List<TransactionDTO> getAllTransactions(String status) {
        List<Transaction> transactions;
        if (status != null && !status.isEmpty()) {
            transactions = repository.findByStatus(status);
        } else {
            transactions = repository.findAll();
        }
        return transactions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TransactionDTO> getReport(LocalDate from, LocalDate to) {
        return repository.findByTradeDateBetween(from, to)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO mapToDTO(Transaction entity) {
        return TransactionDTO.builder()
                .id(entity.getId())
                .tradeId(entity.getTradeId())
                .instrumentType(entity.getInstrumentType())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .tradeDate(entity.getTradeDate())
                .build();
    }
}
