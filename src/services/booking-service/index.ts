import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";


async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const room = await hotelRepository.findRoomById(roomId);

    if (!enrollment) throw notFoundError();
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote
        || !ticket.TicketType.includesHotel) {
        throw forbiddenError();
    }
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();

    const booking = await bookingRepository.createBooking(userId, roomId);

    return { bookingId: booking.id };
}

async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId);

    if (!booking) throw notFoundError();

    return booking;
}

async function updateBooking(bookingId: number, roomId: number, userId: number) {
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw forbiddenError();

    const room = await hotelRepository.findRoomById(roomId);
    if (!room) throw notFoundError();

    if (room.Booking.length >= room.capacity) throw forbiddenError();

    return await bookingRepository.updateBooking(bookingId, roomId);
}

const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingService;