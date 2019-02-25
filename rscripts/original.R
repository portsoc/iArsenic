# this is the original code for deciding the answer based on user inputs
# wrapped with gettting user inputs from the command line

args = commandArgs(trailingOnly=TRUE)

dd <- as.integer(args[1])

input = data.frame(
  colo = args[2],
  div = args[3],
  dis = args[4],
  upa = args[5],
  utensil = args[6],
  flood = args[7]
)

# we don't have inputs for flood and utensil

# we want to log into console, not simply return
paste <- cat

# strata border: 15 50 90 150


##################################################################
# ORIGINAL CODE FOLLOWS


adm.files <- read.csv("data/AdmBnd1b.csv", header = T, stringsAsFactors=F)
fields <- c("div", "dis", "upa", "colo", "utensil", "adepth", "flood", "drink")

df <- data.frame(div = c(adm.files$Division),
                 dis = c(adm.files$District),
                 upa = c(adm.files$Upazila),
                 stringsAsFactors = FALSE,
                 dep = c(adm.files$Depth),
                 asc = c(adm.files$Arsenic))


    


#Selecting the wells data for the Upazila which are <90 m deep
index <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)

# to avoid the problem of no shallow well in some areas
index_2 <- which(df$dep[index] < 90)

#----new for shallow <90 m arsenic range
as_data <-(df$asc[index][index_2])
as_10 <- quantile(as_data, c(0.10), type = 1)
as_90 <- quantile(as_data, c(0.90), type = 1)
#-----


as_mean_a <- mean(df$asc[index][index_2])
as_median_a <- median(df$asc[index][index_2])
as_max_a <- max(df$asc[index][index_2])

as_mean <- if (length(index_2) == 0) {0
}else {as_mean_a}
as_median <- if (length(index_2) == 0) {0
}else {as_median_a}

as_max <- if (length(index_2) == 0) {0
}else {as_max_a}


#--------------
#Selecting the wells data for the Upazila which are >90 m deep
index_150 <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)

index_2_150 <- which(df$dep[index_150] >= 90)

as_mean_150 <- mean(df$asc[index_150][index_2_150])
as_median_150 <- median(df$asc[index_150][index_2_150])
as_max_150 <- max(df$asc[index_150][index_2_150])

#-------------


Pol_stat<-if (((as_median)>20) && (((as_median)<=50))){"likely to be Polluted"
} else if (((as_median)>50) && (((as_median)<=200))){"likely to be HIGHLY Polluted"
} else if ((as_median)>200){"likely to be SEVERELY Polluted"
}else {"likely to be arsenic-safe"}

Max_Pol <- if ((as_max>=0)&&(as_max<=100)){"and concentration may be around"
}else {", a chemical test is needed as concentration can be high, ranging around"
}

#Red platform
Pol_90_g <- if ( (length (index_2_150)>0)) {as_mean_150
  
} else {0} 
Pol_90 <-  if ((Pol_90_g) >=50) {"Your tubewell is highly likely to be Polluted."
} else if (((Pol_90_g) <50) | (((as_median)>0) && ((as_median)<20))) {"Your tubewell may be arsenic-safe."
} else {"Your tubewell may be polluted."
}

Pol_deep <- if (dd >150) {"Your tubewell is HIGHLY likely to be arsenic-safe"
  
}

# rounding up to the next 10
round.choose <- function(x, round.val, dir = 1) {
  if(dir == 1) {  ##ROUND UP
    x + (round.val - x %% round.val)
  } else {
    if(dir == 0) {  ##ROUND DOWN
      x - (x %% round.val)
    }
  }
}
#-----------------

#Assessment based on basement colour


if  ( (input$colo == "Red") && (dd<15) && ((as_median) >= 20)&& (length(index)>0)) {
  
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1),"µg/L", 
         Sep='')
  
} else if ( (input$colo == "Red") && (dd<15) && ((as_median) <= 20)&& (length(index)>0)) {
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1), "µg/L",
         Sep='')
  
} else if( (input$colo == "Red") && ((dd>=15) && (dd<=90)) && ((as_median) >= 20)&& (length(index)>0) ) {
  
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1), "µg/L", 
         Sep='')
  
} else if ( (input$colo == "Red") && ((dd>=15) && (dd<=90)) && ((as_median) <= 20) && (length(index)>0)) {
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1), "µg/L",
         Sep='')
} else if ( (input$colo == "Red") && ((dd>90) && (dd<=150)) && (length(index)>0)) {
  paste (Pol_90)  
  
} else if  ((input$colo == "Red") && (dd>150) && (length(index)>0)) {
  paste (Pol_deep)
  
} else if ((input$colo == "Black") && ((dd>=15) && (dd<=90)) && (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")
  
} else if  ((input$colo == "Black") && ((dd>90) && (dd<=150)) && (length(index)>0)) {
  paste ("Your tubewell is likely to be arsenic-safe")
  
} else if  ((input$colo == "Black") && (dd>150) && (length(index)>0)) {
  paste (Pol_deep)
  
  #Assessment based on utensil colour
  
} else if ( (input$utensil == "Red") && (dd<=15) && ((as_median) >= 20)&& (length(index)>0)) {
  
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1),"µg/L", 
         Sep='')
} else if ( (input$utensil == "Red") && (dd<=15) && ((as_median) <= 20)&& (length(index)>0)) {
  
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1),"µg/L", 
         Sep='')
  
} else if  ((input$utensil == "Red") && ((dd>=15) && (dd<=90)) && ((as_median) <= 20) && (length(index)>0)) {
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1), "µg/L", 
         Sep='')
} else if  ((input$utensil == "Red") && ((dd>=15) && (dd<=90)) && ((as_median) >= 20) && (length(index)>0)) {
  paste ("Your tubewell is", Pol_stat, Max_Pol, round.choose (as_10, 10,1), "to", round.choose (as_90, 10,1), "µg/L", 
         Sep='')
  
} else if  ((input$utensil == "Red") && ((dd>90) && (dd<=150)) && ((length(index)>0))) {
  paste (Pol_90)
  
} else if  ((input$utensil == "Red") && (dd>150) && (length(index)>0)) {
  paste (Pol_deep)
 
} else if ((input$utensil == "No colour change to slightly blackish") && ((dd>=15) && (dd<=90)) && (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")
  
} else if  ((input$utensil == "No colour change to slightly blackish") && ((dd>90) && (dd<=150)) && (length(index)>0)) {
  paste ("Your tubewell is likely to be arsenic-safe")
  
} else if  ((input$utensil == "No colour change to slightly blackish") && (dd>150) && (length(index)>0)) {
  paste (Pol_deep)
  
  # Assessment for shallow well safety && (dd<=15) && (input$pit == "Yes") && (input$flood == "No")
} else if ((input$colo == "Black") && (dd<=15) && (input$flood == "No")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe but may be vulnerable to nitrate and pathogens")  
} else if ((input$colo == "Black") && (dd<=15) && (input$flood == "Yes")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")   
} else if ((input$colo == "Black") && (dd<=15) && (input$flood == "Yes")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe but may be vulnerable to nitrate and pathogens")   
} else if ((input$colo == "Black") && (dd<=15) && (input$flood == "No")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")  
  
} else if ((input$utensil == "No colour change to slightly blackish") && (dd<=15) && (input$flood == "No")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe but may be vulnerable to nitrate and pathogens")  
  
} else if ((input$utensil == "No colour change to slightly blackish") && (dd<=15) && (input$flood == "Yes")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")
} else if ((input$utensil == "No colour change to slightly blackish") && (dd<=15) && (input$flood == "Yes")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe but may be vulnerable to nitrate and pathogens")  
  
} else if ((input$utensil == "No colour change to slightly blackish") && (dd<=15) && (input$flood == "No")&& (length(index)>0)) {
  paste("Your tubewell is likely to be arsenic-safe")  
} else
  paste("We are unable to assess your tubewell with the information you supplied, please fill all the sections")


