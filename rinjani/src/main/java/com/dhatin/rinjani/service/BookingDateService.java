package com.dhatin.rinjani.service;

import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.dhatin.rinjani.model.BookingDateDto;

@Service
public class BookingDateService {

    private final JdbcTemplate jdbcTemplate;

    public BookingDateService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BookingDateDto> getBookedDates() {
        var sql = "SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') AS date, TRUE AS full FROM booking_pendakian GROUP BY DATE_FORMAT(tanggal, '%Y-%m-%d')";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new BookingDateDto(rs.getString("date"), rs.getBoolean("full")));
    }
}
