[//]: # (TODO : Ce ficheir est un exemple tirée d'un de mes projets. Adaptez le à vos besoins.)
[//]: # (       Par exemple, vous pouvez le mettre en français.)
[//]: # (TODO : Remplacer le logo par le logo de votre application. Attention à conserver les sauts de ligne!)
<div align="center">

# Changelog

![Projet Synthèse](.docs/Logo.svg)

</div>

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.4.2 - 2022-09-15

### Added

- Support for `.pdf` and `.docx` files.
- Can now open any submission with the system's file explorer.
- Detect malformed zip archives and warn the user about them.
- Detect unsupported archive formats and warn the user about their presence.
- Show more tooltips around some icons.

### Changed

- Miu no longer renames the submissions.
- When looking for a compatible editor, Miu now looks at every candidate and takes the most likely one instead of the
  first one.
- List of garbage files is now editor dependant, meaning a `.pdf` will be flagged as garbage when inside a Visual Studio
  project, but not when submitted alone.

### Fixes

- When suggesting a folder for extraction, Miu no longer include the original file extension with it.
- Some files are zip files in disguise, like `.docx` files. Miu no longer extract them when opening an archive.

## 0.4.1 - 2022-09-10

### Fixes

- Fixes an issue preventing from opening submissions on unix systems.

## 0.4.0 - 2022-09-10

### Changed

- Complete rewrite of the projet to a [Tauri](https://tauri.app/) application. This means Miu now has a graphical user 
  interface, which is way more user-friendly.
- The Miu logo has been completely redrawn using vector graphics.
- Switched to a GNU GPLv3 license for this version onwards.

### Added

- Drag and Drop support for zip files and folders on the home screen.
- When extracting, Miu automatically suggest an extraction path in the same folder as the archive.
- Workspaces now hold metadata. Miu is not only more efficient, but also :
  - No longer needs to rescan the whole workspace each time a submission is opened.
  - No longer thinks a submission had temporary files after it has been opened once.
  - No longer needs a deep folder structure to keep track of opened and not opened submissions.
- It is now possible to chose which editor (like Visual Studio) to use when opening a submission. Right now,
  the only alternative is Visual Studio Code, as it can open any project.
- Opening all submissions at once is noe possible using Visual Studio Code. 

### Removed

- Removed dependencies to other programs, like 7z. Miu can now extract zip files on her own. Unfortunately, this means
  Miu no longer support `.rar` or `.7z` archives.
- Remove support for most type of projects, except Visual Studio projects (`.sln`) and HTML projects (`index.html`).
  Support for other types of projects will be added in future updates, on a *need to have* basis.
- It is no longer possible to use Miu in a command line. This will be re-added in a future update.


## 0.3.1 - 2021-06-01

### Added

- It is now possible to provide a grading sheet when initializing a workspace. Doing so allows Miu
  to automatically create a grading sheet for each student. Miu will also open the student grading sheet
  at the same time as the student project.

### Changed

- The `extract` subcommand was renamed to `init`, as this does more than just extracting. To prevent breaking
  scripts that uses `miu`, the `extract` was kept as an alias of the new `init` subcommand.
- Updated the command line help to reflect the changes in functionality.

### Fixed

- Fixed typo : `gedit` was named `Notepad++`.

## 0.3.0 - 2021-05-02

### Added

- When extracting, a warning will appear if the archive contained temporary files (like build files).
  Those files will be listed as well.
- Support new project type : text files. If a folder holding only `.txt` files is located, it is opened in a
  text editor. On Windows, Notepad++ will be used. On Linux, gedit will be used.

### Changed

- On Linux, Miu will now try to locate 7z in the `/usr/bin` folder as well.
- New syntax for the `extract` subcommand. The `-o` flag is no longer used : this argument is now positional.
- Improved some error messages.
- `.iml` files are now ignored when archiving and extracting.

### Fixed

- Fixed an issue where archives were appended to, not replaced, if they already existed.
- On Linux, fixed an issue where IntelliJ Idea could not be located inside the Jetbrains Toolbox.
- Fixed an issue where Gradle sub-projects would be opened instead of the root project. When looking for a Gradle
  project, Miu will now look for the `gradlew` file instead of the `build.gradle` file. The `gradlew` file is always
  at the project root directory, but the `build.gradle` file isn't.

## 0.2.0 - 2021-02-07

### Added

- Linux support.

## 0.1.0 - 2021-02-06

### Added

- Extracting archives from Lea.
- Extracting and opening projects in IntelliJ Idea.
- Archiving projects for Lea.
- Configure paths to 7z and IntelliJ Idea.