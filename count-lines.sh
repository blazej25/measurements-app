echo "Total lines of code: "
find src | grep -E '\.ts|\.tsx' | xargs wc -l | grep total | awk '{print $1}'
