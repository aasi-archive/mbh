# Turning the Mahabharata into a beautiful online website

## The Basics

I downloaded the 18 text files from Sacred-Texts.com and realised that every section was demaracted as `SECTION [ROMAN NUMBER]`. That just meant executing a regex for `^SECTION [(IVLMDC)+]$` and soon I had a array of text sections. 

Some parvas at the end have a `FOOTNOTES`, which are then followed by lines that start with a number and a dot, and some text, like: `1. This is footnote.`.

So, for every text file, we first split by `FOOTNOTES`, and then the first part is splitted into sections, and the second part is then split through `^\d+\.` which then forms an array of footnotes for every parva.

After that, we search every section for `[\d+]` (for content like `[1]`, `[57]`, etc.) and then replace it with a tooltip containing the string for the given parva and the footnote.

The verses (sections) are then put into a Jinja2 template.

## Issues

The first issue is that for some sections, the section does not start with `SECTION [ROMAN NUMBER]` but just a `\n[NUMBER]\n`, so we have to take care of these files.

The second issue is that a few sections were misnumbered or missing, these have been corrected in the txt files provided in the project itself.