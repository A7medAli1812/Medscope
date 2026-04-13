using MediatR;
using MedScope.Application.Features.SuperAdmin.Admins.Queries.GetAdmins;
using MedScope.Application.Features.SuperAdmin.Reports;
using MedScope.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedScope.WebApi.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/super-admin/reports")]
    [Authorize(Roles = "SuperAdmin")]
    public class ReportsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IReportService _reportService;

        public ReportsController(IMediator mediator, IReportService reportService)
        {
            _mediator = mediator;
            _reportService = reportService;
        }

        // =========================
        // 1️⃣ Get Dashboard Data
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetReports([FromQuery] int month = 1)
        {
            var result = await _mediator.Send(new GetReportsQuery(month));
            return Ok(result);
        }

        // =========================
        // 2️⃣ Admins PDF
        // =========================
        [HttpGet("admins/pdf")]
        public async Task<IActionResult> ExportAdminsPdf()
        {
            var admins = await _mediator.Send(new GetAdminsQuery());

            var pdf = _reportService.GenerateAdminsReport(admins.Data);

            return File(pdf, "application/pdf", "AdminsReport.pdf");
        }

        // =========================
        // 3️⃣ Admins Excel
        // =========================
        [HttpGet("admins/excel")]
        public async Task<IActionResult> ExportAdminsExcel()
        {
            var admins = await _mediator.Send(new GetAdminsQuery());

            var file = _reportService.GenerateAdminsExcel(admins.Data);

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "AdminsReport.xlsx");
        }

        // =========================
        // 4️⃣ Dashboard PDF 🔥
        // =========================
        [HttpGet("dashboard/pdf")]
        public async Task<IActionResult> ExportDashboardPdf([FromQuery] int month = 1)
        {
            var data = await _mediator.Send(new GetReportsQuery(month));

            var pdf = _reportService.GenerateDashboardReport(data);

            return File(pdf, "application/pdf", "DashboardReport.pdf");
        }

        // =========================
        // 5️⃣ Dashboard Excel 🔥
        // =========================
        [HttpGet("dashboard/excel")]
        public async Task<IActionResult> ExportDashboardExcel([FromQuery] int month = 1)
        {
            var data = await _mediator.Send(new GetReportsQuery(month));

            var file = _reportService.GenerateDashboardExcel(data);

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "DashboardReport.xlsx");
        }
    }
}