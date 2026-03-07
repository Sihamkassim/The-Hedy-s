# Spiritual Leader + Payment Flow

## Purpose
Document the current and intended flow for spiritual leader onboarding and appointment payments.

## Spiritual leader registration flow
1. Client sends POST /api/auth/register with role = spiritual_leader.
2. Required fields (current server validation):
   - name
   - email
   - password
   - religion
   - specialization (or speciality)
   - experience
   - optional sessionPrice and bio
3. Server creates:
   - User with role = spiritual_leader
   - SpiritualLeader profile linked by email
4. Auth response includes:
   - data.user
   - data.spiritualLeaderProfile

Notes:
- These new user fields are optional for now: religion, pseudonym, phoneNumber (to keep current signup working).
- Admin can also create/update/delete spiritual leaders via /api/spiritual-leaders routes.

## Spiritual leader schedule flow
1. Spiritual leader logs in.
2. Client calls GET /api/appointments/my-schedule.
3. Server checks user role:
   - If role is spiritual_leader, it loads spiritualLeader by email.
4. Server returns appointments where appointment.spiritualId = spiritualLeader.id.

## Appointment creation flow (therapist or spiritual leader)
1. Client calls POST /api/appointments with:
   - therapistId OR spiritualId (exactly one)
   - date
   - time
2. Server validates the target exists.
3. Server creates appointment with:
   - status = pending
   - therapistId or spiritualId

## Payment flow (Mpesa) - current status
Data model support is already in place:
- Appointment.mpesaCheckoutId (unique)
- Appointment.status includes paid
- Appointment.videoUrl

Recommended flow to implement next:
1. Client requests payment intent (new endpoint to be added).
2. Server creates Mpesa checkout and stores mpesaCheckoutId on the appointment.
3. Mpesa callback (webhook) updates appointment:
   - status = paid
   - mpesaCheckoutId is confirmed
4. Therapist/spiritual leader can then confirm the appointment.

## Status transitions
- pending -> paid -> confirmed -> completed
- pending/paid/confirmed -> cancelled

## Related endpoints
- POST /api/auth/register
- GET /api/appointments/my-schedule
- POST /api/appointments
- PATCH /api/appointments/:id (status updates)
- GET /api/spiritual-leaders
- POST /api/spiritual-leaders (admin only)

## TODOs
- Add payment initiation endpoint and Mpesa callback handler.
- Update client booking flow to support spiritual leaders and paid status.
