@echo off
echo Creating database backup...
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%

"C:\xampp\mysql\bin\mysqldump.exe" -u root malawi_police_traffic > "database\backup_%timestamp%.sql"

echo ✅ Database backed up to: database\backup_%timestamp%.sql
pause