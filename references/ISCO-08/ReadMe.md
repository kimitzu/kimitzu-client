# Djali Occupation Classification Standard

This is the occupation classification standard used by Djali.

This is based from the [International Standard Classification of Occupations](https://en.wikipedia.org/wiki/International_Standard_Classification_of_Occupations), specifically parsed from these documents:

* Document 1: https://www.ilo.org/public/english/bureau/stat/isco/isco08/index.htm
* Document 2: https://www.ilo.org/public/english/bureau/stat/isco/docs/resol08.pdf

## The Standard

The occupation, along with their unique ID, looks like the this:

> "7234-1" - "Mechanic, bicycle"

`xy..z-n` where `xy..z` is the formal ISCO classification and `n` is the order in which they appear in [Document 1](https://www.ilo.org/public/english/bureau/stat/isco/isco08/index.htm).

The digits are then concatenated to form a hierarchy. From the example above, here is the breakdown per numerical group classification:

    7 - Craft and related trades workers.
        72 - Metal, machinery and related trades workers.
            723 - Machinery mechanics and repairers.
                7234 - Bicycle and related repairers.
                    7234-1 - Mechanic, bicycle