if which gecho > /dev/null
then
  # on mac, gecho is a better echo
  alias echo=gecho
fi

scriptname=${1:-reference.R}

echo using script "$scriptname"

function runtests
{
  if [ -n "$outputfile" ]
  then
    exec >> "$outputfile"
  fi

  for depth in 20 60 100 200  # dropped 10 because we don't do flood
                              # and we don't have utensil yet
  do
    for colour in Red Black
    do
      echo -n \"$div\" \"$dis\" \"$upa\" \"$uni\" $depth $colour '-' '-' ' '
      Rscript "$scriptname" "$div" "$dis" "$upa" "$uni" $depth $colour - -  2>/dev/null || exit -1 # hide warnings
      echo
    done
    for utensil in "Red" "No colour change to slightly blackish"
    do
      colour="none"
      utensilshort=${utensil:0:2}
      echo -n \"$div\" \"$dis\" \"$upa\" \"$uni\" $depth $colour \"$utensilshort\" '-' ' '
      Rscript "$scriptname" "$div" "$dis" "$upa" "$uni" $depth $colour "$utensil" - 2>/dev/null || exit -1 # hide warnings
      echo
    done
  done

  depth=10
  for flooding in "Yes" "No"
  do
    for colour in Red Black
    do
      echo -n \"$div\" \"$dis\" \"$upa\" \"$uni\" $depth $colour '-' \"$flooding\" ' '
      Rscript "$scriptname" "$div" "$dis" "$upa" "$uni" $depth $colour - "$flooding" 2>/dev/null || exit -1 # hide warnings
      echo
    done
    for utensil in "Red" "No colour change to slightly blackish"
    do
      colour="none"
      utensilshort=${utensil:0:2}
      echo -n \"$div\" \"$dis\" \"$upa\" \"$uni\" $depth $colour \"$utensilshort\" \"$flooding\"  ' '
      Rscript "$scriptname" "$div" "$dis" "$upa" "$uni" $depth $colour "$utensil" "$flooding" 2>/dev/null || exit -1 # hide warnings
      echo
    done
  done
}
