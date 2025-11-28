using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BloodDonationSystem.Services;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly BloodBankService _bloodBankService;
        private readonly BloodRequestService _bloodRequestService;
        private readonly UserService _userService;
        private readonly DonorProfileService _donorService;
        private readonly RecipientProfileService _recipientService;
        private readonly DonationRecordService _donationService;
        private readonly AppointmentService _appointmentService;
        private readonly BloodStockService _bloodStockService;
        private readonly NotificationLogService _notificationService;

        public DashboardController(
            BloodBankService bloodBankService,
            BloodRequestService bloodRequestService,
            UserService userService,
            DonorProfileService donorService,
            RecipientProfileService recipientService,
            DonationRecordService donationService,
            AppointmentService appointmentService,
            BloodStockService bloodStockService,
            NotificationLogService notificationService)
        {
            _bloodBankService = bloodBankService;
            _bloodRequestService = bloodRequestService;
            _userService = userService;
            _donorService = donorService;
            _recipientService = recipientService;
            _donationService = donationService;
            _appointmentService = appointmentService;
            _bloodStockService = bloodStockService;
            _notificationService = notificationService;
        }

        [HttpGet("counts")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult> GetDashboardCounts()
        {
            try
            {
                var bloodBanks = await _bloodBankService.GetAllBloodBanks();
                var bloodRequests = await _bloodRequestService.GetAllBloodRequests();
                var users = await _userService.GetAllUsers();
                var donors = await _donorService.GetAllDonors();
                var recipients = await _recipientService.GetAllRecipients();
                var donations = await _donationService.GetAllDonations();
                var appointments = await _appointmentService.GetAllAppointments();
                var bloodStock = await _bloodStockService.GetAllBloodStocks();
                var notifications = await _notificationService.GetAllNotifications();

                var counts = new
                {
                    bloodBanks = bloodBanks.Count(),
                    bloodRequests = bloodRequests.Count(),
                    users = users.Count(),
                    donors = donors.Count(),
                    recipients = recipients.Count(),
                    donations = donations.Count(),
                    appointments = appointments.Count(),
                    bloodStock = bloodStock.Count(),
                    notifications = notifications.Count()
                };

                return Ok(counts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("overview")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult> GetDashboardOverview()
        {
            try
            {
                var bloodBanks = await _bloodBankService.GetAllBloodBanks();
                var bloodRequests = await _bloodRequestService.GetAllBloodRequests();
                var users = await _userService.GetAllUsers();
                var donors = await _donorService.GetAllDonors();
                var recipients = await _recipientService.GetAllRecipients();
                var donations = await _donationService.GetAllDonations();
                var appointments = await _appointmentService.GetAllAppointments();
                var bloodStock = await _bloodStockService.GetAllBloodStocks();
                var notifications = await _notificationService.GetAllNotifications();

                var overview = new
                {
                    counts = new
                    {
                        bloodBanks = bloodBanks.Count(),
                        bloodRequests = bloodRequests.Count(),
                        users = users.Count(),
                        donors = donors.Count(),
                        recipients = recipients.Count(),
                        donations = donations.Count(),
                        appointments = appointments.Count(),
                        bloodStock = bloodStock.Count(),
                        notifications = notifications.Count()
                    },
                    recentRequests = bloodRequests.OrderByDescending(r => r.RequestDate).Take(5),
                    recentAppointments = appointments.OrderByDescending(a => a.AppointmentDate).Take(5),
                    systemStats = new
                    {
                        totalDonations = donations.Count(),
                        pendingRequests = bloodRequests.Count(r => r.Status == "Pending"),
                        completedRequests = bloodRequests.Count(r => r.Status == "Completed" || r.Status == "Fulfilled"),
                        upcomingAppointments = appointments.Count(a => a.AppointmentDate > DateTime.Now),
                        unreadNotifications = notifications.Count(n => !n.IsRead)
                    }
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}