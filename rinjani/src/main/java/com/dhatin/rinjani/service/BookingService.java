package com.dhatin.rinjani.service;

import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.dhatin.rinjani.model.BookingDto;

@Service
public class BookingService {

    private final JdbcTemplate jdbcTemplate;

    public BookingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BookingDto> getAllBookings() {
        var sql = "SELECT booking_id AS id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS date, nama_pendaki AS hikerName, email, telepon AS phone, jumlah_pendaki AS hikersCount, lama_hari AS days, porter_needed AS porterNeeded, guide_needed AS guideNeeded, gear_rental_needed AS gearRentalNeeded, total_price AS totalPrice, status, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS createdAt FROM booking_pendakian ORDER BY tanggal, created_at";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new BookingDto(
            rs.getString("id"),
            rs.getString("date"),
            rs.getString("hikerName"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getInt("hikersCount"),
            rs.getInt("days"),
            rs.getBoolean("porterNeeded"),
            rs.getBoolean("guideNeeded"),
            rs.getBoolean("gearRentalNeeded"),
            rs.getDouble("totalPrice"),
            rs.getString("status"),
            rs.getString("createdAt")
        ));
    }

    public BookingDto saveBooking(BookingDto booking) {
        var id = booking.id() == null || booking.id().isBlank() ? "plan-" + UUID.randomUUID() : booking.id();
        var sql = "INSERT INTO booking_pendakian (booking_id, tanggal, nama_pendaki, email, telepon, jumlah_pendaki, lama_hari, porter_needed, guide_needed, gear_rental_needed, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            id,
            booking.date(),
            booking.hikerName(),
            booking.email(),
            booking.phone(),
            booking.hikersCount(),
            booking.days(),
            booking.porterNeeded(),
            booking.guideNeeded(),
            booking.gearRentalNeeded(),
            booking.totalPrice(),
            booking.status() == null || booking.status().isBlank() ? "pending" : booking.status()
        );
        return new BookingDto(
            id,
            booking.date(),
            booking.hikerName(),
            booking.email(),
            booking.phone(),
            booking.hikersCount(),
            booking.days(),
            booking.porterNeeded(),
            booking.guideNeeded(),
            booking.gearRentalNeeded(),
            booking.totalPrice(),
            booking.status() == null || booking.status().isBlank() ? "pending" : booking.status(),
            java.time.LocalDateTime.now().toString()
        );
    }

    public BookingDto updateBooking(String id, BookingDto booking) {
        var sql = "UPDATE booking_pendakian SET tanggal = ?, nama_pendaki = ?, email = ?, telepon = ?, jumlah_pendaki = ?, lama_hari = ?, porter_needed = ?, guide_needed = ?, gear_rental_needed = ?, total_price = ?, status = ? WHERE booking_id = ?";
        jdbcTemplate.update(sql,
            booking.date(),
            booking.hikerName(),
            booking.email(),
            booking.phone(),
            booking.hikersCount(),
            booking.days(),
            booking.porterNeeded(),
            booking.guideNeeded(),
            booking.gearRentalNeeded(),
            booking.totalPrice(),
            booking.status() == null || booking.status().isBlank() ? "pending" : booking.status(),
            id
        );
        return new BookingDto(
            id,
            booking.date(),
            booking.hikerName(),
            booking.email(),
            booking.phone(),
            booking.hikersCount(),
            booking.days(),
            booking.porterNeeded(),
            booking.guideNeeded(),
            booking.gearRentalNeeded(),
            booking.totalPrice(),
            booking.status() == null || booking.status().isBlank() ? "pending" : booking.status(),
            booking.createdAt() == null || booking.createdAt().isBlank() ? java.time.LocalDateTime.now().toString() : booking.createdAt()
        );
    }

    public void deleteBooking(String id) {
        jdbcTemplate.update("DELETE FROM booking_pendakian WHERE booking_id = ?", id);
    }
}
