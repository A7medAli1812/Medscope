using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    public partial class AddHospitalIdToAppointments_V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1️⃣ Add HospitalId column to Appointments
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 1
            );

            // 2️⃣ Create index
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_HospitalId",
                table: "Appointments",
                column: "HospitalId"
            );

            // 3️⃣ Add foreign key to existing Hospitals table
            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Hospitals_HospitalId",
                table: "Appointments",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Hospitals_HospitalId",
                table: "Appointments"
            );

            migrationBuilder.DropIndex(
                name: "IX_Appointments_HospitalId",
                table: "Appointments"
            );

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Appointments"
            );
        }
    }
}
