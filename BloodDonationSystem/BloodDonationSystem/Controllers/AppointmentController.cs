using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentService _appointmentService;

        public AppointmentController(AppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAllAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAllAppointments();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<AppointmentResponseDto>> GetAppointmentById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid appointment ID" });

                var appointment = await _appointmentService.GetAppointmentById(id);
                return Ok(appointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("donor/{donorId}")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAppointmentsByDonor(int donorId)
        {
            try
            {
                if (donorId <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                var appointments = await _appointmentService.GetAppointmentsByDonor(donorId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("upcoming")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetUpcomingAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetUpcomingAppointments();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<AppointmentResponseDto>> CreateAppointment([FromBody] AppointmentCreateDto appointmentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _appointmentService.CreateAppointment(appointmentDto);
                return CreatedAtAction(nameof(GetAppointmentById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<AppointmentResponseDto>> UpdateAppointment(int id, [FromBody] AppointmentUpdateDto appointmentDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid appointment ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _appointmentService.UpdateAppointment(id, appointmentDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<AppointmentResponseDto>> CancelAppointment(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid appointment ID" });

                var cancelled = await _appointmentService.CancelAppointment(id);
                return Ok(cancelled);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("get-by-donor")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAppointmentsByDonorPayload([FromBody] DonorIdPayload payload)
        {
            try
            {
                if (payload.DonorId <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                var appointments = await _appointmentService.GetAppointmentsByDonor(payload.DonorId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("update-status")]
        [Authorize(Roles = "0")] 
        public async Task<ActionResult<AppointmentResponseDto>> UpdateAppointmentStatus([FromBody] AppointmentStatusUpdatePayload payload)
        {
            try
            {
                if (payload.Id <= 0)
                    return BadRequest(new { message = "Invalid appointment ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updateDto = new AppointmentUpdateDto { Status = payload.Status };
                var updated = await _appointmentService.UpdateAppointment(payload.Id, updateDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
