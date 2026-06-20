using ClosedXML.Excel;
using MedScope.Application.DTOs.Admin;
using MedScope.Application.Features.SuperAdmin.Reports;
using MedScope.Application.Features.SuperAdmin.Admins;
using MedScope.Application.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace MedScope.Infrastructure.Services.Reports
{
    public class ReportService : IReportService
    {
        // =========================
        // ADMINS PDF
        // =========================
        public byte[] GenerateAdminsReport(List<AdminDto> admins)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);

                    page.Header()
                        .Text("Admins Report")
                        .FontSize(20)
                        .Bold();

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Name").Bold();
                            header.Cell().Text("Email").Bold();
                            header.Cell().Text("Status").Bold();
                        });

                        foreach (var admin in admins)
                        {
                            table.Cell().Text(admin.Name ?? "");
                            table.Cell().Text(admin.Email ?? "");
                            table.Cell().Text(admin.Status ?? "");
                        }
                    });
                });
            }).GeneratePdf();
        }

        // =========================
        // ADMINS EXCEL
        // =========================
        public byte[] GenerateAdminsExcel(List<AdminDto> admins)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Admins");

            worksheet.Cell(1, 1).Value = "Name";
            worksheet.Cell(1, 2).Value = "Email";
            worksheet.Cell(1, 3).Value = "Status";

            for (int i = 0; i < admins.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = admins[i].Name;
                worksheet.Cell(i + 2, 2).Value = admins[i].Email;
                worksheet.Cell(i + 2, 3).Value = admins[i].Status;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        // =========================
        // DASHBOARD PDF 🔥
        // =========================
        public byte[] GenerateDashboardReport(ReportsDto data)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);

                    // Header
                    page.Header()
                        .Text("Dashboard Report")
                        .FontSize(20)
                        .Bold();

                    page.Content().Column(col =>
                    {
                        col.Spacing(10);

                        // ======================
                        // User Growth
                        // ======================
                        col.Item().Text("User Growth").Bold();

                        foreach (var item in data.UserGrowth)
                        {
                            col.Item().Text($"Date: {item.Date} | Patients: {item.Patients} | Doctors: {item.Doctors}");
                        }

                        // ======================
                        // Hospital Distribution
                        // ======================
                        col.Item().PaddingTop(10).Text("Hospital Distribution").Bold();

                        foreach (var item in data.HospitalDistribution)
                        {
                            col.Item().Text($"{item.City} : {item.Count}");
                        }
                    });
                });
            }).GeneratePdf();
        }


        // =========================
        // DASHBOARD EXCEL 🔥
        // =========================
        public byte[] GenerateDashboardExcel(ReportsDto data)
        {
            using var workbook = new XLWorkbook();

            // ======================
            // Sheet 1 - User Growth
            // ======================
            var sheet1 = workbook.Worksheets.Add("UserGrowth");

            sheet1.Cell(1, 1).Value = "Date";
            sheet1.Cell(1, 2).Value = "Patients";
            sheet1.Cell(1, 3).Value = "Doctors";

            for (int i = 0; i < data.UserGrowth.Count; i++)
            {
                sheet1.Cell(i + 2, 1).Value = data.UserGrowth[i].Date;
                sheet1.Cell(i + 2, 2).Value = data.UserGrowth[i].Patients;
                sheet1.Cell(i + 2, 3).Value = data.UserGrowth[i].Doctors;
            }

            // ======================
            // Sheet 2 - Distribution
            // ======================
            var sheet2 = workbook.Worksheets.Add("HospitalDistribution");

            sheet2.Cell(1, 1).Value = "City";
            sheet2.Cell(1, 2).Value = "Count";

            for (int i = 0; i < data.HospitalDistribution.Count; i++)
            {
                sheet2.Cell(i + 2, 1).Value = data.HospitalDistribution[i].City;
                sheet2.Cell(i + 2, 2).Value = data.HospitalDistribution[i].Count;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);

            return stream.ToArray();
        }
    }
}