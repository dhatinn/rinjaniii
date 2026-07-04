package com.dhatin.rinjani.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dhatin.rinjani.model.BookingDateDto;
import com.dhatin.rinjani.model.BookingDto;
import com.dhatin.rinjani.service.BookingDateService;
import com.dhatin.rinjani.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingDateController {

    private final BookingDateService bookingDateService;
    private final BookingService bookingService;

    public BookingDateController(BookingDateService bookingDateService, BookingService bookingService) {
        this.bookingDateService = bookingDateService;
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingDto> getBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    public BookingDto createBooking(@RequestBody BookingDto booking) {
        return bookingService.saveBooking(booking);
    }

    @PutMapping("/{id}")
    public BookingDto updateBooking(@PathVariable String id, @RequestBody BookingDto booking) {
        return bookingService.updateBooking(id, booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
    }

    @GetMapping("/dates")
    public List<BookingDateDto> getBookingDates() {
        return bookingDateService.getBookedDates();
    }
}
