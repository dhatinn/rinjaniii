package com.dhatin.rinjani.model;

public record BookingDto(
    String id,
    String date,
    String hikerName,
    String email,
    String phone,
    int hikersCount,
    int days,
    boolean porterNeeded,
    boolean guideNeeded,
    boolean gearRentalNeeded,
    double totalPrice,
    String status,
    String createdAt
) {
}
