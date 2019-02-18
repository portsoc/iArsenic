if which gecho > /dev/null
then
  # on mac, gecho is a better echo
  alias echo=gecho
fi

scriptname=${1:-refactored.R}

echo using script "$scriptname"


function runtests
{
  for depth in 20 60 100 200  # dropped 10 because we don't do flood
                              # and we don't have utensil yet
  do
    for colour in Red Black
    do
      echo -n \"$div\" \"$dis\" \"$upa\" $depth $colour '-' '-' ' '
      Rscript "$scriptname" $depth $colour "$div" "$dis" "$upa" 2>/dev/null # hide warnings
      echo
    done
    for utensil in "Red" "No colour change to slightly blackish"
    do
      colour="none"
      utensilshort=${utensil:0:2}
      echo -n \"$div\" \"$dis\" \"$upa\" $depth $colour \"$utensilshort\" '-' ' '
      Rscript "$scriptname" $depth $colour "$div" "$dis" "$upa" "$utensil" 2>/dev/null # hide warnings
      echo
    done
  done

  depth=10
  for flooding in "Yes" "No"
  do
    for colour in Red Black
    do
      echo -n \"$div\" \"$dis\" \"$upa\" $depth $colour '-' \"$flooding\" ' '
      Rscript "$scriptname" $depth $colour "$div" "$dis" "$upa" "" "$flooding" 2>/dev/null # hide warnings
      echo
    done
    for utensil in "Red" "No colour change to slightly blackish"
    do
      colour="none"
      utensilshort=${utensil:0:2}
      echo -n \"$div\" \"$dis\" \"$upa\" $depth $colour \"$utensilshort\" \"$flooding\"  ' '
      Rscript "$scriptname" $depth $colour "$div" "$dis" "$upa" "$utensil" "$flooding" 2>/dev/null # hide warnings
      echo
    done
  done
}

div="Barisal" dis="Barguna" upa="Amtali" runtests 
div="Barisal" dis="Barguna" upa="Bamna" runtests
div="Barisal" dis="Barguna" upa="Barguna Sadar" runtests
div="Barisal" dis="Barguna" upa="Betagi" runtests
div="Barisal" dis="Barguna" upa="Patharghata" runtests
div="Barisal" dis="Barisal" upa="Agailjhara" runtests
div="Barisal" dis="Barisal" upa="Babuganj" runtests
div="Barisal" dis="Barisal" upa="Bakerganj" runtests
div="Barisal" dis="Barisal" upa="Banari Para" runtests
div="Barisal" dis="Barisal" upa="Barisal Sadar (Kotwali)" runtests
div="Barisal" dis="Barisal" upa="Gaurnadi" runtests
div="Barisal" dis="Barisal" upa="Hizla" runtests
div="Barisal" dis="Barisal" upa="Mehendiganj" runtests
div="Barisal" dis="Barisal" upa="Muladi" runtests
div="Barisal" dis="Barisal" upa="Wazirpur" runtests
div="Barisal" dis="Bhola" upa="Bhola Sadar" runtests
div="Barisal" dis="Bhola" upa="Burhanuddin" runtests
div="Barisal" dis="Bhola" upa="Char Fasson" runtests
div="Barisal" dis="Bhola" upa="Daulatkhan" runtests
div="Barisal" dis="Bhola" upa="Lalmohan" runtests
div="Barisal" dis="Bhola" upa="Manpura" runtests
div="Barisal" dis="Bhola" upa="Tazumuddin" runtests
div="Barisal" dis="Jhalokati" upa="Jhalokati Sadar" runtests
div="Barisal" dis="Jhalokati" upa="Kanthalia" runtests
div="Barisal" dis="Jhalokati" upa="Nalchity" runtests
div="Barisal" dis="Jhalokati" upa="Rajapur" runtests
div="Barisal" dis="Patuakhali" upa="Bauphal" runtests
div="Barisal" dis="Patuakhali" upa="Dashmina" runtests
div="Barisal" dis="Patuakhali" upa="Dumki" runtests
div="Barisal" dis="Patuakhali" upa="Galachipa" runtests
div="Barisal" dis="Patuakhali" upa="Kala Para" runtests
div="Barisal" dis="Patuakhali" upa="Mirzaganj" runtests
div="Barisal" dis="Patuakhali" upa="Patuakhali Sadar" runtests
div="Barisal" dis="Pirojpur" upa="Bhandaria" runtests
div="Barisal" dis="Pirojpur" upa="Kawkhali" runtests
div="Barisal" dis="Pirojpur" upa="Mathbaria" runtests
div="Barisal" dis="Pirojpur" upa="Nazirpur" runtests
div="Barisal" dis="Pirojpur" upa="Nesarabad (Swarupkati)" runtests
div="Barisal" dis="Pirojpur" upa="Pirojpur Sadar" runtests
div="Barisal" dis="Pirojpur" upa="Zianagar" runtests
div="Chittagong" dis="Bandarban" upa="Alikadam" runtests
div="Chittagong" dis="Bandarban" upa="Bandarban Sadar" runtests
div="Chittagong" dis="Bandarban" upa="Lama" runtests
div="Chittagong" dis="Bandarban" upa="Naikhongchhari" runtests
div="Chittagong" dis="Bandarban" upa="Rowangchhari" runtests
div="Chittagong" dis="Bandarban" upa="Ruma" runtests
div="Chittagong" dis="Bandarban" upa="Thanchi" runtests
div="Chittagong" dis="Brahamanbaria" upa="Akhaura" runtests
div="Chittagong" dis="Brahamanbaria" upa="Ashuganj" runtests
div="Chittagong" dis="Brahamanbaria" upa="Banchharampur" runtests
div="Chittagong" dis="Brahamanbaria" upa="Bijoynagar" runtests
div="Chittagong" dis="Brahamanbaria" upa="Brahmanbaria Sadar" runtests
div="Chittagong" dis="Brahamanbaria" upa="Kasba" runtests
div="Chittagong" dis="Brahamanbaria" upa="Nabinagar" runtests
div="Chittagong" dis="Brahamanbaria" upa="Nasirnagar" runtests
div="Chittagong" dis="Brahamanbaria" upa="Sarail" runtests
div="Chittagong" dis="Chandpur" upa="Chandpur Sadar" runtests
div="Chittagong" dis="Chandpur" upa="Faridganj" runtests
div="Chittagong" dis="Chandpur" upa="Haim Char" runtests
div="Chittagong" dis="Chandpur" upa="Hajiganj" runtests
div="Chittagong" dis="Chandpur" upa="Kachua" runtests
div="Chittagong" dis="Chandpur" upa="Matlab Dakshin" runtests
div="Chittagong" dis="Chandpur" upa="Matlab Uttar" runtests
div="Chittagong" dis="Chandpur" upa="Shahrasti" runtests
div="Chittagong" dis="Chittagong" upa="Anowara" runtests
div="Chittagong" dis="Chittagong" upa="Bakalia" runtests
div="Chittagong" dis="Chittagong" upa="Banshkhali" runtests
div="Chittagong" dis="Chittagong" upa="Bayejid Bostami" runtests
div="Chittagong" dis="Chittagong" upa="Boalkhali" runtests
div="Chittagong" dis="Chittagong" upa="Chandanaish" runtests
div="Chittagong" dis="Chittagong" upa="Chandgaon" runtests
div="Chittagong" dis="Chittagong" upa="Chittagong Port" runtests
div="Chittagong" dis="Chittagong" upa="Double Mooring" runtests
div="Chittagong" dis="Chittagong" upa="Fatikchhari" runtests
div="Chittagong" dis="Chittagong" upa="Halishahar" runtests
div="Chittagong" dis="Chittagong" upa="Hathazari" runtests
div="Chittagong" dis="Chittagong" upa="Khulshi" runtests
div="Chittagong" dis="Chittagong" upa="Kotwali" runtests
div="Chittagong" dis="Chittagong" upa="Lohagara" runtests
div="Chittagong" dis="Chittagong" upa="Mirsharai" runtests
div="Chittagong" dis="Chittagong" upa="Pahartali" runtests
div="Chittagong" dis="Chittagong" upa="Panchlaish" runtests
div="Chittagong" dis="Chittagong" upa="Patenga" runtests
div="Chittagong" dis="Chittagong" upa="Patiya" runtests
div="Chittagong" dis="Chittagong" upa="Rangunia" runtests
div="Chittagong" dis="Chittagong" upa="Raozan" runtests
div="Chittagong" dis="Chittagong" upa="Sandwip" runtests
div="Chittagong" dis="Chittagong" upa="Satkania" runtests
div="Chittagong" dis="Chittagong" upa="Sitakunda" runtests
div="Chittagong" dis="Comilla" upa="Barura" runtests
div="Chittagong" dis="Comilla" upa="Brahman Para" runtests
div="Chittagong" dis="Comilla" upa="Burichang" runtests
div="Chittagong" dis="Comilla" upa="Chandina" runtests
div="Chittagong" dis="Comilla" upa="Chauddagram" runtests
div="Chittagong" dis="Comilla" upa="Comilla Adarsha Sadar" runtests
div="Chittagong" dis="Comilla" upa="Comilla Sadar Dakshin" runtests
div="Chittagong" dis="Comilla" upa="Daudkandi" runtests
div="Chittagong" dis="Comilla" upa="Debidwar" runtests
div="Chittagong" dis="Comilla" upa="Homna" runtests
div="Chittagong" dis="Comilla" upa="Laksam" runtests
div="Chittagong" dis="Comilla" upa="Manoharganj" runtests
div="Chittagong" dis="Comilla" upa="Meghna" runtests
div="Chittagong" dis="Comilla" upa="Muradnagar" runtests
div="Chittagong" dis="Comilla" upa="Nangalkot" runtests
div="Chittagong" dis="Comilla" upa="Titas" runtests
div="Chittagong" dis="Cox's Bazar" upa="Chakaria" runtests
div="Chittagong" dis="Cox's Bazar" upa="Cox's Bazar Sadar" runtests
div="Chittagong" dis="Cox's Bazar" upa="Kutubdia" runtests
div="Chittagong" dis="Cox's Bazar" upa="Maheshkhali" runtests
div="Chittagong" dis="Cox's Bazar" upa="Pekua" runtests
div="Chittagong" dis="Cox's Bazar" upa="Ramu" runtests
div="Chittagong" dis="Cox's Bazar" upa="Teknaf" runtests
div="Chittagong" dis="Cox's Bazar" upa="Ukhia" runtests
div="Chittagong" dis="Feni" upa="Chhagalnaiya" runtests
div="Chittagong" dis="Feni" upa="Daganbhuiyan" runtests
div="Chittagong" dis="Feni" upa="Feni Sadar" runtests
div="Chittagong" dis="Feni" upa="Fulgazi" runtests
div="Chittagong" dis="Feni" upa="Parshuram" runtests
div="Chittagong" dis="Feni" upa="Sonagazi" runtests
div="Chittagong" dis="Khagrachhari" upa="Dighinala" runtests
div="Chittagong" dis="Khagrachhari" upa="Khagrachhari Sadar" runtests
div="Chittagong" dis="Khagrachhari" upa="Lakshmichhari" runtests
div="Chittagong" dis="Khagrachhari" upa="Mahalchhari" runtests
div="Chittagong" dis="Khagrachhari" upa="Manikchhari" runtests
div="Chittagong" dis="Khagrachhari" upa="Matiranga" runtests
div="Chittagong" dis="Khagrachhari" upa="Panchhari" runtests
div="Chittagong" dis="Khagrachhari" upa="Ramgarh" runtests
div="Chittagong" dis="Lakshmipur" upa="Kamalnagar" runtests
div="Chittagong" dis="Lakshmipur" upa="Lakshmipur Sadar" runtests
div="Chittagong" dis="Lakshmipur" upa="Ramganj" runtests
div="Chittagong" dis="Lakshmipur" upa="Ramgati" runtests
div="Chittagong" dis="Lakshmipur" upa="Roypur" runtests
div="Chittagong" dis="Noakhali" upa="Begumganj" runtests
div="Chittagong" dis="Noakhali" upa="Chatkhil" runtests
div="Chittagong" dis="Noakhali" upa="Companiganj" runtests
div="Chittagong" dis="Noakhali" upa="Hatiya" runtests
div="Chittagong" dis="Noakhali" upa="Kabirhat" runtests
div="Chittagong" dis="Noakhali" upa="Noakhali Sadar (Sudharam)" runtests
div="Chittagong" dis="Noakhali" upa="Senbagh" runtests
div="Chittagong" dis="Noakhali" upa="Sonaimuri" runtests
div="Chittagong" dis="Noakhali" upa="Subarnachar" runtests
div="Chittagong" dis="Rangamati" upa="Baghai Chhari" runtests
div="Chittagong" dis="Rangamati" upa="Barkal" runtests
div="Chittagong" dis="Rangamati" upa="Belai Chhari" runtests
div="Chittagong" dis="Rangamati" upa="Jurai Chhari" runtests
div="Chittagong" dis="Rangamati" upa="Kaptai" runtests
div="Chittagong" dis="Rangamati" upa="Kawkhali (Betbunia)" runtests
div="Chittagong" dis="Rangamati" upa="Langadu" runtests
div="Chittagong" dis="Rangamati" upa="Naniarchar" runtests
div="Chittagong" dis="Rangamati" upa="Rajasthali" runtests
div="Chittagong" dis="Rangamati" upa="Rangamati Sadar" runtests
div="Dhaka" dis="Dhaka" upa="Adabor" runtests
div="Dhaka" dis="Dhaka" upa="Badda" runtests
div="Dhaka" dis="Dhaka" upa="Bangshal" runtests
div="Dhaka" dis="Dhaka" upa="Biman Bandar" runtests
div="Dhaka" dis="Dhaka" upa="Cantonment" runtests
div="Dhaka" dis="Dhaka" upa="Chak Bazar" runtests
div="Dhaka" dis="Dhaka" upa="Dakshinkhan" runtests
div="Dhaka" dis="Dhaka" upa="Darus Salam" runtests
div="Dhaka" dis="Dhaka" upa="Demra" runtests
div="Dhaka" dis="Dhaka" upa="Dhamrai" runtests
div="Dhaka" dis="Dhaka" upa="Dhanmondi" runtests
div="Dhaka" dis="Dhaka" upa="Dohar" runtests
div="Dhaka" dis="Dhaka" upa="Gendaria" runtests
div="Dhaka" dis="Dhaka" upa="Gulshan" runtests
div="Dhaka" dis="Dhaka" upa="Hazaribagh" runtests
div="Dhaka" dis="Dhaka" upa="Jatrabari" runtests
div="Dhaka" dis="Dhaka" upa="Kadamtali" runtests
div="Dhaka" dis="Dhaka" upa="Kafrul" runtests
div="Dhaka" dis="Dhaka" upa="Kalabagan" runtests
div="Dhaka" dis="Dhaka" upa="Kamrangir Char" runtests
div="Dhaka" dis="Dhaka" upa="Keraniganj" runtests
div="Dhaka" dis="Dhaka" upa="Khilgaon" runtests
div="Dhaka" dis="Dhaka" upa="Khilkhet" runtests
div="Dhaka" dis="Dhaka" upa="Kotwali" runtests
div="Dhaka" dis="Dhaka" upa="Lalbagh" runtests
div="Dhaka" dis="Dhaka" upa="Mirpur" runtests
div="Dhaka" dis="Dhaka" upa="Mohammadpur" runtests
div="Dhaka" dis="Dhaka" upa="Motijheel" runtests
div="Dhaka" dis="Dhaka" upa="Nawabganj" runtests
div="Dhaka" dis="Dhaka" upa="New Market" runtests
div="Dhaka" dis="Dhaka" upa="Pallabi" runtests
div="Dhaka" dis="Dhaka" upa="Paltan" runtests
div="Dhaka" dis="Dhaka" upa="Ramna" runtests
div="Dhaka" dis="Dhaka" upa="Rampura" runtests
div="Dhaka" dis="Dhaka" upa="Sabujbagh" runtests
div="Dhaka" dis="Dhaka" upa="Savar" runtests
div="Dhaka" dis="Dhaka" upa="Shah Ali" runtests
div="Dhaka" dis="Dhaka" upa="Shahbagh" runtests
div="Dhaka" dis="Dhaka" upa="Sher-e-bangla Nagar" runtests
div="Dhaka" dis="Dhaka" upa="Shyampur" runtests
div="Dhaka" dis="Dhaka" upa="Sutrapur" runtests
div="Dhaka" dis="Dhaka" upa="Tejgaon" runtests
div="Dhaka" dis="Dhaka" upa="Tejgaon Ind. Area" runtests
div="Dhaka" dis="Dhaka" upa="Turag" runtests
div="Dhaka" dis="Dhaka" upa="Uttar Khan" runtests
div="Dhaka" dis="Dhaka" upa="Uttara" runtests
div="Dhaka" dis="Faridpur" upa="Alfadanga" runtests
div="Dhaka" dis="Faridpur" upa="Bhanga" runtests
div="Dhaka" dis="Faridpur" upa="Boalmari" runtests
div="Dhaka" dis="Faridpur" upa="Char Bhadrasan" runtests
div="Dhaka" dis="Faridpur" upa="Faridpur Sadar" runtests
div="Dhaka" dis="Faridpur" upa="Madhukhali" runtests
div="Dhaka" dis="Faridpur" upa="Nagarkanda" runtests
div="Dhaka" dis="Faridpur" upa="Sadarpur" runtests
div="Dhaka" dis="Faridpur" upa="Saltha" runtests
div="Dhaka" dis="Gazipur" upa="Gazipur Sadar" runtests
div="Dhaka" dis="Gazipur" upa="Kaliakair" runtests
div="Dhaka" dis="Gazipur" upa="Kaliganj" runtests
div="Dhaka" dis="Gazipur" upa="Kapasia" runtests
div="Dhaka" dis="Gazipur" upa="Sreepur" runtests
div="Dhaka" dis="Gopalganj" upa="Gopalganj Sadar" runtests
div="Dhaka" dis="Gopalganj" upa="Kashiani" runtests
div="Dhaka" dis="Gopalganj" upa="Kotali Para" runtests
div="Dhaka" dis="Gopalganj" upa="Muksudpur" runtests
div="Dhaka" dis="Gopalganj" upa="Tungi Para" runtests
div="Dhaka" dis="Kishoreganj" upa="Austagram" runtests
div="Dhaka" dis="Kishoreganj" upa="Bajitpur" runtests
div="Dhaka" dis="Kishoreganj" upa="Bhairab" runtests
div="Dhaka" dis="Kishoreganj" upa="Hossainpur" runtests
div="Dhaka" dis="Kishoreganj" upa="Itna" runtests
div="Dhaka" dis="Kishoreganj" upa="Karimganj" runtests
div="Dhaka" dis="Kishoreganj" upa="Katiadi" runtests
div="Dhaka" dis="Kishoreganj" upa="Kishoreganj Sadar" runtests
div="Dhaka" dis="Kishoreganj" upa="Kuliar Char" runtests
div="Dhaka" dis="Kishoreganj" upa="Mithamain" runtests
div="Dhaka" dis="Kishoreganj" upa="Nikli" runtests
div="Dhaka" dis="Kishoreganj" upa="Pakundia" runtests
div="Dhaka" dis="Kishoreganj" upa="Tarail" runtests
div="Dhaka" dis="Madaripur" upa="Kalkini" runtests
div="Dhaka" dis="Madaripur" upa="Madaripur Sadar" runtests
div="Dhaka" dis="Madaripur" upa="Rajoir" runtests
div="Dhaka" dis="Madaripur" upa="Shib Char" runtests
div="Dhaka" dis="Manikganj" upa="Daulatpur" runtests
div="Dhaka" dis="Manikganj" upa="Ghior" runtests
div="Dhaka" dis="Manikganj" upa="Harirampur" runtests
div="Dhaka" dis="Manikganj" upa="Manikganj Sadar" runtests
div="Dhaka" dis="Manikganj" upa="Saturia" runtests
div="Dhaka" dis="Manikganj" upa="Shibalaya" runtests
div="Dhaka" dis="Manikganj" upa="Singair" runtests
div="Dhaka" dis="Munshiganj" upa="Gazaria" runtests
div="Dhaka" dis="Munshiganj" upa="Lohajang" runtests
div="Dhaka" dis="Munshiganj" upa="Munshiganj Sadar" runtests
div="Dhaka" dis="Munshiganj" upa="Serajdikhan" runtests
div="Dhaka" dis="Munshiganj" upa="Sreenagar" runtests
div="Dhaka" dis="Munshiganj" upa="Tongibari" runtests
div="Dhaka" dis="Narayanganj" upa="Araihazar" runtests
div="Dhaka" dis="Narayanganj" upa="Bandar" runtests
div="Dhaka" dis="Narayanganj" upa="Narayanganj Sadar" runtests
div="Dhaka" dis="Narayanganj" upa="Rupganj" runtests
div="Dhaka" dis="Narayanganj" upa="Sonargaon" runtests
div="Dhaka" dis="Narsingdi" upa="Belabo" runtests
div="Dhaka" dis="Narsingdi" upa="Manohardi" runtests
div="Dhaka" dis="Narsingdi" upa="Narsingdi Sadar" runtests
div="Dhaka" dis="Narsingdi" upa="Palash" runtests
div="Dhaka" dis="Narsingdi" upa="Roypura" runtests
div="Dhaka" dis="Narsingdi" upa="Shibpur" runtests
div="Dhaka" dis="Rajbari" upa="Balia Kandi" runtests
div="Dhaka" dis="Rajbari" upa="Goalandaghat" runtests
div="Dhaka" dis="Rajbari" upa="Kalukhali" runtests
div="Dhaka" dis="Rajbari" upa="Pangsha" runtests
div="Dhaka" dis="Rajbari" upa="Rajbari Sadar" runtests
div="Dhaka" dis="Shariatpur" upa="Bhedarganj" runtests
div="Dhaka" dis="Shariatpur" upa="Damudya" runtests
div="Dhaka" dis="Shariatpur" upa="Gosairhat" runtests
div="Dhaka" dis="Shariatpur" upa="Naria" runtests
div="Dhaka" dis="Shariatpur" upa="Shariatpur Sadar" runtests
div="Dhaka" dis="Shariatpur" upa="Zanjira" runtests
div="Dhaka" dis="Tangail" upa="Basail" runtests
div="Dhaka" dis="Tangail" upa="Bhuapur" runtests
div="Dhaka" dis="Tangail" upa="Delduar" runtests
div="Dhaka" dis="Tangail" upa="Dhanbari" runtests
div="Dhaka" dis="Tangail" upa="Ghatail" runtests
div="Dhaka" dis="Tangail" upa="Gopalpur" runtests
div="Dhaka" dis="Tangail" upa="Kalihati" runtests
div="Dhaka" dis="Tangail" upa="Madhupur" runtests
div="Dhaka" dis="Tangail" upa="Mirzapur" runtests
div="Dhaka" dis="Tangail" upa="Nagarpur" runtests
div="Dhaka" dis="Tangail" upa="Sakhipur" runtests
div="Dhaka" dis="Tangail" upa="Tangail Sadar" runtests
div="Division" dis="District" upa="Upazila" runtests
div="Khulna" dis="Bagerhat" upa="Bagerhat Sadar" runtests
div="Khulna" dis="Bagerhat" upa="Chitalmari" runtests
div="Khulna" dis="Bagerhat" upa="Fakirhat" runtests
div="Khulna" dis="Bagerhat" upa="Kachua" runtests
div="Khulna" dis="Bagerhat" upa="Mollahat" runtests
div="Khulna" dis="Bagerhat" upa="Mongla" runtests
div="Khulna" dis="Bagerhat" upa="Morrelganj" runtests
div="Khulna" dis="Bagerhat" upa="Rampal" runtests
div="Khulna" dis="Bagerhat" upa="Sarankhola" runtests
div="Khulna" dis="Chuadanga" upa="Alamdanga" runtests
div="Khulna" dis="Chuadanga" upa="Chuadanga Sadar" runtests
div="Khulna" dis="Chuadanga" upa="Damurhuda" runtests
div="Khulna" dis="Chuadanga" upa="Jiban Nagar" runtests
div="Khulna" dis="Jessore" upa="Abhaynagar" runtests
div="Khulna" dis="Jessore" upa="Bagher Para" runtests
div="Khulna" dis="Jessore" upa="Chaugachha" runtests
div="Khulna" dis="Jessore" upa="Jhikargachha" runtests
div="Khulna" dis="Jessore" upa="Keshabpur" runtests
div="Khulna" dis="Jessore" upa="Kotwali" runtests
div="Khulna" dis="Jessore" upa="Manirampur" runtests
div="Khulna" dis="Jessore" upa="Sharsha" runtests
div="Khulna" dis="Jhenaidah" upa="Harinakunda" runtests
div="Khulna" dis="Jhenaidah" upa="Jhenaidah Sadar" runtests
div="Khulna" dis="Jhenaidah" upa="Kaliganj" runtests
div="Khulna" dis="Jhenaidah" upa="Kotchandpur" runtests
div="Khulna" dis="Jhenaidah" upa="Maheshpur" runtests
div="Khulna" dis="Jhenaidah" upa="Shailkupa" runtests
div="Khulna" dis="Khulna" upa="Batiaghata" runtests
div="Khulna" dis="Khulna" upa="Dacope" runtests
div="Khulna" dis="Khulna" upa="Daulatpur" runtests
div="Khulna" dis="Khulna" upa="Dighalia" runtests
div="Khulna" dis="Khulna" upa="Dumuria" runtests
div="Khulna" dis="Khulna" upa="Khalishpur" runtests
div="Khulna" dis="Khulna" upa="Khan Jahan Ali" runtests
div="Khulna" dis="Khulna" upa="Khulna Sadar" runtests
div="Khulna" dis="Khulna" upa="Koyra" runtests
div="Khulna" dis="Khulna" upa="Paikgachha" runtests
div="Khulna" dis="Khulna" upa="Phultala" runtests
div="Khulna" dis="Khulna" upa="Rupsa" runtests
div="Khulna" dis="Khulna" upa="Sonadanga" runtests
div="Khulna" dis="Khulna" upa="Terokhada" runtests
div="Khulna" dis="Kushtia" upa="Bheramara" runtests
div="Khulna" dis="Kushtia" upa="Daulatpur" runtests
div="Khulna" dis="Kushtia" upa="Khoksa" runtests
div="Khulna" dis="Kushtia" upa="Kumarkhali" runtests
div="Khulna" dis="Kushtia" upa="Kushtia Sadar" runtests
div="Khulna" dis="Kushtia" upa="Mirpur" runtests
div="Khulna" dis="Magura" upa="Magura Sadar" runtests
div="Khulna" dis="Magura" upa="Mohammadpur" runtests
div="Khulna" dis="Magura" upa="Shalikha" runtests
div="Khulna" dis="Magura" upa="Sreepur" runtests
div="Khulna" dis="Meherpur" upa="Gangni" runtests
div="Khulna" dis="Meherpur" upa="Meherpur Sadar" runtests
div="Khulna" dis="Meherpur" upa="Mujib Nagar" runtests
div="Khulna" dis="Narail" upa="Kalia" runtests
div="Khulna" dis="Narail" upa="Lohagara" runtests
div="Khulna" dis="Narail" upa="Narail Sadar" runtests
div="Khulna" dis="Satkhira" upa="Assasuni" runtests
div="Khulna" dis="Satkhira" upa="Debhata" runtests
div="Khulna" dis="Satkhira" upa="Kalaroa" runtests
div="Khulna" dis="Satkhira" upa="Kaliganj" runtests
div="Khulna" dis="Satkhira" upa="Satkhira Sadar" runtests
div="Khulna" dis="Satkhira" upa="Shyamnagar" runtests
div="Khulna" dis="Satkhira" upa="Tala" runtests
div="Mymensingh" dis="Jamalpur" upa="Bakshiganj" runtests
div="Mymensingh" dis="Jamalpur" upa="Dewanganj" runtests
div="Mymensingh" dis="Jamalpur" upa="Islampur" runtests
div="Mymensingh" dis="Jamalpur" upa="Jamalpur Sadar" runtests
div="Mymensingh" dis="Jamalpur" upa="Madarganj" runtests
div="Mymensingh" dis="Jamalpur" upa="Melandaha" runtests
div="Mymensingh" dis="Jamalpur" upa="Sarishabari" runtests
div="Mymensingh" dis="Mymensingh" upa="Bhaluka" runtests
div="Mymensingh" dis="Mymensingh" upa="Dhobaura" runtests
div="Mymensingh" dis="Mymensingh" upa="Fulbaria" runtests
div="Mymensingh" dis="Mymensingh" upa="Gaffargaon" runtests
div="Mymensingh" dis="Mymensingh" upa="Gauripur" runtests
div="Mymensingh" dis="Mymensingh" upa="Haluaghat" runtests
div="Mymensingh" dis="Mymensingh" upa="Ishwarganj" runtests
div="Mymensingh" dis="Mymensingh" upa="Muktagachha" runtests
div="Mymensingh" dis="Mymensingh" upa="Mymensingh Sadar" runtests
div="Mymensingh" dis="Mymensingh" upa="Nandail" runtests
div="Mymensingh" dis="Mymensingh" upa="Phulpur" runtests
div="Mymensingh" dis="Mymensingh" upa="Trishal" runtests
div="Mymensingh" dis="Netrakona" upa="Atpara" runtests
div="Mymensingh" dis="Netrakona" upa="Barhatta" runtests
div="Mymensingh" dis="Netrakona" upa="Durgapur" runtests
div="Mymensingh" dis="Netrakona" upa="Kalmakanda" runtests
div="Mymensingh" dis="Netrakona" upa="Kendua" runtests
div="Mymensingh" dis="Netrakona" upa="Khaliajuri" runtests
div="Mymensingh" dis="Netrakona" upa="Madan" runtests
div="Mymensingh" dis="Netrakona" upa="Mohanganj" runtests
div="Mymensingh" dis="Netrakona" upa="Netrokona Sadar" runtests
div="Mymensingh" dis="Netrakona" upa="Purbadhala" runtests
div="Mymensingh" dis="Sherpur" upa="Jhenaigati" runtests
div="Mymensingh" dis="Sherpur" upa="Nakla" runtests
div="Mymensingh" dis="Sherpur" upa="Nalitabari" runtests
div="Mymensingh" dis="Sherpur" upa="Sherpur Sadar" runtests
div="Mymensingh" dis="Sherpur" upa="Sreebardi" runtests
div="Rajshahi" dis="Bogra" upa="Adamdighi" runtests
div="Rajshahi" dis="Bogra" upa="Bogra Sadar" runtests
div="Rajshahi" dis="Bogra" upa="Dhunat" runtests
div="Rajshahi" dis="Bogra" upa="Dhupchanchia" runtests
div="Rajshahi" dis="Bogra" upa="Gabtali" runtests
div="Rajshahi" dis="Bogra" upa="Kahaloo" runtests
div="Rajshahi" dis="Bogra" upa="Nandigram" runtests
div="Rajshahi" dis="Bogra" upa="Sariakandi" runtests
div="Rajshahi" dis="Bogra" upa="Shajahanpur" runtests
div="Rajshahi" dis="Bogra" upa="Sherpur" runtests
div="Rajshahi" dis="Bogra" upa="Shibganj" runtests
div="Rajshahi" dis="Bogra" upa="Sonatola" runtests
div="Rajshahi" dis="Joypurhat" upa="Akkelpur" runtests
div="Rajshahi" dis="Joypurhat" upa="Joypurhat Sadar" runtests
div="Rajshahi" dis="Joypurhat" upa="Kalai" runtests
div="Rajshahi" dis="Joypurhat" upa="Khetlal" runtests
div="Rajshahi" dis="Joypurhat" upa="Panchbibi" runtests
div="Rajshahi" dis="Naogaon" upa="Atrai" runtests
div="Rajshahi" dis="Naogaon" upa="Badalgachhi" runtests
div="Rajshahi" dis="Naogaon" upa="Dhamoirhat" runtests
div="Rajshahi" dis="Naogaon" upa="Mahadebpur" runtests
div="Rajshahi" dis="Naogaon" upa="Manda" runtests
div="Rajshahi" dis="Naogaon" upa="Naogaon Sadar" runtests
div="Rajshahi" dis="Naogaon" upa="Niamatpur" runtests
div="Rajshahi" dis="Naogaon" upa="Patnitala" runtests
div="Rajshahi" dis="Naogaon" upa="Porsha" runtests
div="Rajshahi" dis="Naogaon" upa="Raninagar" runtests
div="Rajshahi" dis="Naogaon" upa="Sapahar" runtests
div="Rajshahi" dis="Natore" upa="Bagati Para" runtests
div="Rajshahi" dis="Natore" upa="Baraigram" runtests
div="Rajshahi" dis="Natore" upa="Gurudaspur" runtests
div="Rajshahi" dis="Natore" upa="Lalpur" runtests
div="Rajshahi" dis="Natore" upa="Natore Sadar" runtests
div="Rajshahi" dis="Natore" upa="Singra" runtests
div="Rajshahi" dis="Nawabganj" upa="Bholahat" runtests
div="Rajshahi" dis="Nawabganj" upa="Gomastapur" runtests
div="Rajshahi" dis="Nawabganj" upa="Nachole" runtests
div="Rajshahi" dis="Nawabganj" upa="Nawabganj Sadar" runtests
div="Rajshahi" dis="Nawabganj" upa="Shibganj" runtests
div="Rajshahi" dis="Pabna" upa="Atgharia" runtests
div="Rajshahi" dis="Pabna" upa="Bera" runtests
div="Rajshahi" dis="Pabna" upa="Bhangura" runtests
div="Rajshahi" dis="Pabna" upa="Chatmohar" runtests
div="Rajshahi" dis="Pabna" upa="Faridpur" runtests
div="Rajshahi" dis="Pabna" upa="Ishwardi" runtests
div="Rajshahi" dis="Pabna" upa="Pabna Sadar" runtests
div="Rajshahi" dis="Pabna" upa="Santhia" runtests
div="Rajshahi" dis="Pabna" upa="Sujanagar" runtests
div="Rajshahi" dis="Rajshahi" upa="Bagha" runtests
div="Rajshahi" dis="Rajshahi" upa="Baghmara" runtests
div="Rajshahi" dis="Rajshahi" upa="Boalia" runtests
div="Rajshahi" dis="Rajshahi" upa="Charghat" runtests
div="Rajshahi" dis="Rajshahi" upa="Durgapur" runtests
div="Rajshahi" dis="Rajshahi" upa="Godagari" runtests
div="Rajshahi" dis="Rajshahi" upa="Matihar" runtests
div="Rajshahi" dis="Rajshahi" upa="Mohanpur" runtests
div="Rajshahi" dis="Rajshahi" upa="Paba" runtests
div="Rajshahi" dis="Rajshahi" upa="Puthia" runtests
div="Rajshahi" dis="Rajshahi" upa="Rajpara" runtests
div="Rajshahi" dis="Rajshahi" upa="Shah Makhdum" runtests
div="Rajshahi" dis="Rajshahi" upa="Tanore" runtests
div="Rajshahi" dis="Sirajganj" upa="Belkuchi" runtests
div="Rajshahi" dis="Sirajganj" upa="Chauhali" runtests
div="Rajshahi" dis="Sirajganj" upa="Kamarkhanda" runtests
div="Rajshahi" dis="Sirajganj" upa="Kazipur" runtests
div="Rajshahi" dis="Sirajganj" upa="Royganj" runtests
div="Rajshahi" dis="Sirajganj" upa="Shahjadpur" runtests
div="Rajshahi" dis="Sirajganj" upa="Sirajganj Sadar" runtests
div="Rajshahi" dis="Sirajganj" upa="Tarash" runtests
div="Rajshahi" dis="Sirajganj" upa="Ullah Para" runtests
div="Rangpur" dis="Dinajpur" upa="Biral" runtests
div="Rangpur" dis="Dinajpur" upa="Birampur" runtests
div="Rangpur" dis="Dinajpur" upa="Birganj" runtests
div="Rangpur" dis="Dinajpur" upa="Bochaganj" runtests
div="Rangpur" dis="Dinajpur" upa="Chirirbandar" runtests
div="Rangpur" dis="Dinajpur" upa="Dinajpur Sadar" runtests
div="Rangpur" dis="Dinajpur" upa="Fulbari" runtests
div="Rangpur" dis="Dinajpur" upa="Ghoraghat" runtests
div="Rangpur" dis="Dinajpur" upa="Hakimpur" runtests
div="Rangpur" dis="Dinajpur" upa="Kaharole" runtests
div="Rangpur" dis="Dinajpur" upa="Khansama" runtests
div="Rangpur" dis="Dinajpur" upa="Nawabganj" runtests
div="Rangpur" dis="Dinajpur" upa="Parbatipur" runtests
div="Rangpur" dis="Gaibandha" upa="Fulchhari" runtests
div="Rangpur" dis="Gaibandha" upa="Gaibandha Sadar" runtests
div="Rangpur" dis="Gaibandha" upa="Gobindaganj" runtests
div="Rangpur" dis="Gaibandha" upa="Palashbari" runtests
div="Rangpur" dis="Gaibandha" upa="Sadullapur" runtests
div="Rangpur" dis="Gaibandha" upa="Saghatta" runtests
div="Rangpur" dis="Gaibandha" upa="Sundarganj" runtests
div="Rangpur" dis="Kurigram" upa="Bhurungamari" runtests
div="Rangpur" dis="Kurigram" upa="Char Rajibpur" runtests
div="Rangpur" dis="Kurigram" upa="Chilmari" runtests
div="Rangpur" dis="Kurigram" upa="Kurigram Sadar" runtests
div="Rangpur" dis="Kurigram" upa="Nageshwari" runtests
div="Rangpur" dis="Kurigram" upa="Phulbari" runtests
div="Rangpur" dis="Kurigram" upa="Rajarhat" runtests
div="Rangpur" dis="Kurigram" upa="Raumari" runtests
div="Rangpur" dis="Kurigram" upa="Ulipur" runtests
div="Rangpur" dis="Lalmonirhat" upa="Aditmari" runtests
div="Rangpur" dis="Lalmonirhat" upa="Hatibandha" runtests
div="Rangpur" dis="Lalmonirhat" upa="Kaliganj" runtests
div="Rangpur" dis="Lalmonirhat" upa="Lalmonirhat Sadar" runtests
div="Rangpur" dis="Lalmonirhat" upa="Patgram" runtests
div="Rangpur" dis="Nilphamari" upa="Dimla" runtests
div="Rangpur" dis="Nilphamari" upa="Domar" runtests
div="Rangpur" dis="Nilphamari" upa="Jaldhaka" runtests
div="Rangpur" dis="Nilphamari" upa="Kishoreganj" runtests
div="Rangpur" dis="Nilphamari" upa="Nilphamari Sadar" runtests
div="Rangpur" dis="Nilphamari" upa="Saidpur" runtests
div="Rangpur" dis="Panchagarh" upa="Atwari" runtests
div="Rangpur" dis="Panchagarh" upa="Boda" runtests
div="Rangpur" dis="Panchagarh" upa="Debiganj" runtests
div="Rangpur" dis="Panchagarh" upa="Panchagarh Sadar" runtests
div="Rangpur" dis="Panchagarh" upa="Tentulia" runtests
div="Rangpur" dis="Rangpur" upa="Badarganj" runtests
div="Rangpur" dis="Rangpur" upa="Gangachara" runtests
div="Rangpur" dis="Rangpur" upa="Kaunia" runtests
div="Rangpur" dis="Rangpur" upa="Mitha Pukur" runtests
div="Rangpur" dis="Rangpur" upa="Pirgachha" runtests
div="Rangpur" dis="Rangpur" upa="Pirganj" runtests
div="Rangpur" dis="Rangpur" upa="Rangpur Sadar" runtests
div="Rangpur" dis="Rangpur" upa="Taraganj" runtests
div="Rangpur" dis="Thakurgaon" upa="Baliadangi" runtests
div="Rangpur" dis="Thakurgaon" upa="Haripur" runtests
div="Rangpur" dis="Thakurgaon" upa="Pirganj" runtests
div="Rangpur" dis="Thakurgaon" upa="Ranisankail" runtests
div="Rangpur" dis="Thakurgaon" upa="Thakurgaon Sadar" runtests
div="Sylhet" dis="Habiganj" upa="Ajmiriganj" runtests
div="Sylhet" dis="Habiganj" upa="Bahubal" runtests
div="Sylhet" dis="Habiganj" upa="Baniachong" runtests
div="Sylhet" dis="Habiganj" upa="Chunarughat" runtests
div="Sylhet" dis="Habiganj" upa="Habiganj Sadar" runtests
div="Sylhet" dis="Habiganj" upa="Lakhai" runtests
div="Sylhet" dis="Habiganj" upa="Madhabpur" runtests
div="Sylhet" dis="Habiganj" upa="Nabiganj" runtests
div="Sylhet" dis="Maulvibazar" upa="Barlekha" runtests
div="Sylhet" dis="Maulvibazar" upa="Juri" runtests
div="Sylhet" dis="Maulvibazar" upa="Kamalganj" runtests
div="Sylhet" dis="Maulvibazar" upa="Kulaura" runtests
div="Sylhet" dis="Maulvibazar" upa="Maulvi Bazar Sadar" runtests
div="Sylhet" dis="Maulvibazar" upa="Rajnagar" runtests
div="Sylhet" dis="Maulvibazar" upa="Sreemangal" runtests
div="Sylhet" dis="Sunamganj" upa="Bishwambarpur" runtests
div="Sylhet" dis="Sunamganj" upa="Chhatak" runtests
div="Sylhet" dis="Sunamganj" upa="Dakshin Sunamganj" runtests
div="Sylhet" dis="Sunamganj" upa="Derai" runtests
div="Sylhet" dis="Sunamganj" upa="Dharampasha" runtests
div="Sylhet" dis="Sunamganj" upa="Dowarabazar" runtests
div="Sylhet" dis="Sunamganj" upa="Jagannathpur" runtests
div="Sylhet" dis="Sunamganj" upa="Jamalganj" runtests
div="Sylhet" dis="Sunamganj" upa="Sulla" runtests
div="Sylhet" dis="Sunamganj" upa="Sunamganj Sadar" runtests
div="Sylhet" dis="Sunamganj" upa="Tahirpur" runtests
div="Sylhet" dis="Sylhet" upa="Balaganj" runtests
div="Sylhet" dis="Sylhet" upa="Beani Bazar" runtests
div="Sylhet" dis="Sylhet" upa="Bishwanath" runtests
div="Sylhet" dis="Sylhet" upa="Companiganj" runtests
div="Sylhet" dis="Sylhet" upa="Dakshin Surma" runtests
div="Sylhet" dis="Sylhet" upa="Fenchuganj" runtests
div="Sylhet" dis="Sylhet" upa="Golabganj" runtests
div="Sylhet" dis="Sylhet" upa="Gowainghat" runtests
div="Sylhet" dis="Sylhet" upa="Jaintiapur" runtests
div="Sylhet" dis="Sylhet" upa="Kanaighat" runtests
div="Sylhet" dis="Sylhet" upa="Sylhet Sadar" runtests
div="Sylhet" dis="Sylhet" upa="Zakiganj" runtests
