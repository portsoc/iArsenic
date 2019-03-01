# check if we have enough data in every district

scriptname=${1:-reference.R}

function runchecks
{
  for depth in 80 100
  do
    echo -n \"$div\" \"$dis\" $depth " "
    Rscript "$scriptname" "$div" "$dis" "none" "none" $depth "Red" - -  2>/dev/null # hide warnings
    echo
  done
}

div="Barisal" dis="Barguna" runchecks
div="Barisal" dis="Barisal" runchecks
div="Barisal" dis="Bhola" runchecks
div="Barisal" dis="Jhalokati" runchecks
div="Barisal" dis="Patuakhali" runchecks
div="Barisal" dis="Pirojpur" runchecks
div="Chittagong" dis="Bandarban" runchecks
div="Chittagong" dis="Brahamanbaria" runchecks
div="Chittagong" dis="Chandpur" runchecks
div="Chittagong" dis="Chittagong" runchecks
div="Chittagong" dis="Comilla" runchecks
div="Chittagong" dis="Cox's Bazar" runchecks
div="Chittagong" dis="Feni" runchecks
div="Chittagong" dis="Khagrachhari" runchecks
div="Chittagong" dis="Lakshmipur" runchecks
div="Chittagong" dis="Noakhali" runchecks
div="Chittagong" dis="Rangamati" runchecks
div="Dhaka" dis="Dhaka" runchecks
div="Dhaka" dis="Faridpur" runchecks
div="Dhaka" dis="Gazipur" runchecks
div="Dhaka" dis="Gopalganj" runchecks
div="Dhaka" dis="Kishoreganj" runchecks
div="Dhaka" dis="Madaripur" runchecks
div="Dhaka" dis="Manikganj" runchecks
div="Dhaka" dis="Munshiganj" runchecks
div="Dhaka" dis="Narayanganj" runchecks
div="Dhaka" dis="Narsingdi" runchecks
div="Dhaka" dis="Rajbari" runchecks
div="Dhaka" dis="Shariatpur" runchecks
div="Dhaka" dis="Tangail" runchecks
div="Khulna" dis="Bagerhat" runchecks
div="Khulna" dis="Chuadanga" runchecks
div="Khulna" dis="Jessore" runchecks
div="Khulna" dis="Jhenaidah" runchecks
div="Khulna" dis="Khulna" runchecks
div="Khulna" dis="Kushtia" runchecks
div="Khulna" dis="Magura" runchecks
div="Khulna" dis="Meherpur" runchecks
div="Khulna" dis="Narail" runchecks
div="Khulna" dis="Satkhira" runchecks
div="Mymensingh" dis="Jamalpur" runchecks
div="Mymensingh" dis="Mymensingh" runchecks
div="Mymensingh" dis="Netrakona" runchecks
div="Mymensingh" dis="Sherpur" runchecks
div="Rajshahi" dis="Bogra" runchecks
div="Rajshahi" dis="Joypurhat" runchecks
div="Rajshahi" dis="Naogaon" runchecks
div="Rajshahi" dis="Natore" runchecks
div="Rajshahi" dis="Nawabganj" runchecks
div="Rajshahi" dis="Pabna" runchecks
div="Rajshahi" dis="Rajshahi" runchecks
div="Rajshahi" dis="Sirajganj" runchecks
div="Rangpur" dis="Dinajpur" runchecks
div="Rangpur" dis="Gaibandha" runchecks
div="Rangpur" dis="Kurigram" runchecks
div="Rangpur" dis="Lalmonirhat" runchecks
div="Rangpur" dis="Nilphamari" runchecks
div="Rangpur" dis="Panchagarh" runchecks
div="Rangpur" dis="Rangpur" runchecks
div="Rangpur" dis="Thakurgaon" runchecks
div="Sylhet" dis="Habiganj" runchecks
div="Sylhet" dis="Maulvibazar" runchecks
div="Sylhet" dis="Sunamganj" runchecks
div="Sylhet" dis="Sylhet" runchecks
