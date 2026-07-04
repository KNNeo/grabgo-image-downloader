#!/usr/bin/env bash
set -e

echo "---- DEBUG START ----"

URL="$1"
# Fix desktop launcher quoting
URL="${URL%\"}"
URL="${URL#\"}"
echo "Full URL: $URL"

# Extract query string after '?'
QUERY="${URL#*\?}"
echo "Query string: $QUERY"

# URL decode function
urldecode() {
    local s="${1//+/ }"
    printf '%b' "${s//%/\\x}"
}

# Initialize
url_enc=""
name_enc=""
dir_enc=""

# Extract parameters manually
for param in ${QUERY//&/ }; do
    key="${param%%=*}"
    val="${param#*=}"
    case "$key" in
        url) url_enc="$val" ;;
        name) name_enc="$val" ;;
        folder) dir_enc="$val" ;;
    esac
done

echo "Encoded URL: $url_enc"
echo "Encoded Name: $name_enc"
echo "Encoded Directory: $dir_enc"

# Decode
url=$(urldecode "$url_enc")
name=$(urldecode "$name_enc")
dir=$(urldecode "$dir_enc")

echo "Decoded URL: $url"
echo "Decoded Name: $name"
echo "Decoded Directory: $dir"

# Set directory/file variables
TARGET="/Pictures"
OUT="$TARGET/$dir/$name"

# Find parent directory, fail if missing
echo "Target directory: $TARGET"
if [[ ! -d "$TARGET" ]]; then
    notify-send -a "Grab & Go Image Downloader" -h string:x-canonical-private-synchronous:dlapp_process -t 10 "Save to $dir failed" "Output folder not found"
    exit 1
fi

# Find destination file, fail if exists (no overwrite)
echo "Output file: $OUT"
if [[ -e "$OUT" ]]; then
    notify-send -a "Grab & Go Image Downloader" -h string:x-canonical-private-synchronous:dlapp_process -t 10 "Save to $dir failed" "File already exists: $name"
    exit 1
fi

# Download file to destination (assume no auth)
curl -fL "$url" -o "$OUT"
notify-send -a "Grab & Go Image Downloader" -h string:x-canonical-private-synchronous:dlapp_process -t 10 "Saved to $dir" "$name"

echo "---- DEBUG END ----"
