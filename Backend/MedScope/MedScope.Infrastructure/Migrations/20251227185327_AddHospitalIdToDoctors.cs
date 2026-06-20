using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    public partial class AddHospitalIdToDoctors : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1️⃣ Add HospitalId column
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 1
            );

            // 2️⃣ Create index
            migrationBuilder.CreateIndex(
                name: "IX_Doctors_HospitalId",
                table: "Doctors",
                column: "HospitalId"
            );

            // 3️⃣ Add foreign key
            migrationBuilder.AddForeignKey(
                name: "FK_Doctors_Hospitals_HospitalId",
                table: "Doctors",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctors_Hospitals_HospitalId",
                table: "Doctors"
            );

            migrationBuilder.DropIndex(
                name: "IX_Doctors_HospitalId",
                table: "Doctors"
            );

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Doctors"
            );
        }
    }
}
