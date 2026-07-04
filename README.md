# Grab & Go Image Downloader
One click image downloader based on URI parameters


## How It Works
- Upon scroll, UserScript will detect images on websites and add buttons on post/images
- Upon left click of 👤 button, opens URI detected by OS when mapped accordingly (see "Mapping" section)
- OS detects URI and fetches image in time (as per user session, will get images generated via session URL; Instagram's CDN is Facebook domain which URL has session ID)
- AddGroupFolder option is for downloading to root folder as assigned in downloader, enable/disable in UserScript

## Prerequisites
- Window / Linux (Ubuntu-based)
- Browser with UserScript agent installed (eg. Tampermonkey)

## Setup
1. Use Tampermonkey to import userscript(s):
- Twitter/X (browser_scripts/twitter.user.js)
- Instagram (browser_scripts/instagram.user.js)
- Create your own, where output URI has to be the following:
```
dlapp://save?url={link}&name={filename}&folder={folder}
```
Replace {folder} with directory format start with slash (for Linux) or backslash (for Windows), {filename} with file name of output, and {link} with URL to GET from

2. Place downloader in operating system
- Windows
Put dlapp_downloader.ps1 in C:\\Users\\{user}\\.local\\dlapp_downloader.ps1 where {user} is user name
- Linux
Put dlapp_downloader.sh in /home/{user}/.local/bin/dlapp_downloader.sh where {user} is user name

3. Download registration of URI dependent scripts based on operating system
- Windows Powershell (uri_registration/dlapp_registry.reg)
- Linux (Bash Script) (uri_registration/dlapp_xdg.desktop)
Replace {user} with user directory to install per user

4. Install registration:
- For Windows, double-click dlapp_registry.reg file to Merge into Registry
- For Linux, run the following command on your Terminal with the dlapp_xdg.desktop file:
```
sudo cp dlapp_xdg.desktop ~/.local/ /home/{user}/.local/bin/
chmod +x /home/{user}/.local/bin/dlapp_downloader.sh
update-desktop-database ~/.local/share/applications
```
Replace {user} with user directory to install per user

5. Voilà!

## Mapping
Each UserScript (by domain) has their own mapping stored in localStorage, stored in the following key-value format:
- Permanent folder mapping
```
<account-name>/<folder-name>
```
where `<folder-name>` is the destination folder you want the image to be saved to, and `<account-name>` is (@username in Twitter/X, username in Instagram)
- Temporary folder mapping
```
<folder-name>
```
where `<folder-name>` is the destination folder you want the image to be saved to, and has to be keyed in for accounts you don't want mapping of (eg. split images into folders within an account)
- No mapping for group folder, as common folder is determined in downloader script

Mapping can also be overwritten in the UserScript by storing it in `list` variable, and can be backed up in Tampermonkey for personal use
