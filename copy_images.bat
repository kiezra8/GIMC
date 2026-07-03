@echo off
echo Copying GIMC website images...
set SRC=C:\Users\Jolly\.gemini\antigravity\brain\c78e7542-d312-405a-bbd7-1cde17a10333
set DST=%~dp0images

if not exist "%DST%" mkdir "%DST%"

copy /Y "%SRC%\hero_carousel_1_1783104658115.png" "%DST%\hero1.png"
copy /Y "%SRC%\hero_carousel_2_1783104669415.png" "%DST%\hero2.png"
copy /Y "%SRC%\outreach_bp_check_1783104612472.png" "%DST%\hero3.png"
copy /Y "%SRC%\team_photo_1783104621735.png" "%DST%\team.png"
copy /Y "%SRC%\outreach_bp_check_1783104612472.png" "%DST%\outreach1.png"
copy /Y "%SRC%\health_education_talk_1783104632327.png" "%DST%\edu.png"
copy /Y "%SRC%\maternal_health_outreach_1783104648739.png" "%DST%\maternal.png"

echo Done! Images copied to: %DST%
pause
