args <- commandArgs(trailingOnly=TRUE)

dd <- as.integer(args[1])

input <- data.frame(
  colo = args[2],
  div = args[3],
  dis = args[4],
  upa = args[5],
  utensil = args[6],
  flood = args[7]
)

if (is.na(input$utensil)) {input$utensil = ' '}
if (is.na(input$flood)) {input$flood = ' '}

# we want to log into console, not simply return
paste <- cat

# strata border: 15 50 90 150

adm.files <- read.csv("data/AdmBnd1b.csv", header = T, stringsAsFactors=F)

df <- data.frame(div = c(adm.files$Division),
                 dis = c(adm.files$District),
                 upa = c(adm.files$Upazila),
                 stringsAsFactors = FALSE,
                 dep = c(adm.files$Depth),
                 asc = c(adm.files$Arsenic))

#Selecting the wells data for the Upazila which are <90 m deep
wells_in_area <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)

# to avoid the problem of no shallow well in some areas (what?)
wells_under_90 <- which(df$dep[wells_in_area] < 90)

#----new for shallow <90 m arsenic range
arsenic_under_90 <-(df$asc[wells_in_area][wells_under_90])
lower_quantile_under_90 <- quantile(arsenic_under_90, c(0.10), type = 1)
upper_quantile_under_90 <- quantile(arsenic_under_90, c(0.90), type = 1)
if (length(wells_under_90) == 0) { arsenic_under_90 = 0 }
as_median_under_90 <- median(arsenic_under_90)
as_max_under_90 <- max(arsenic_under_90)

#Selecting the wells data for the Upazila which are >90 m deep
wells_over_90 <- which(df$dep[wells_in_area] >= 90)
arsenic_over_90 <- df$asc[wells_in_area][wells_over_90]
if (length(wells_over_90) == 0){ arsenic_over_90 = 0 }
as_mean_over_90 <- mean(arsenic_over_90)

#the following three pieces of code decide the output message
pollution_status_under_90 <-
  if ((as_median_under_90>20) && (as_median_under_90<=50)) {
    "likely to be Polluted"
  } else if ((as_median_under_90>50) && (as_median_under_90<=200)) {
    "likely to be HIGHLY Polluted"
  } else if (as_median_under_90>200) {
    "likely to be SEVERELY Polluted"
  } else {
    "likely to be arsenic-safe"
  }

chem_test <-
  if ((as_max_under_90>=0) && (as_max_under_90<=100)) {
    "and concentration may be around"
  }else {
    ", a chemical test is needed as concentration can be high, ranging around"
  }


# rounding up to the next round.val (e.g. to the next 10)
round.choose <- function(x, round.val, dir = 1) {
  if(dir == 1) {  ##ROUND UP
    x + (round.val - x %% round.val)
  } else {
    if(dir == 0) {  ##ROUND DOWN
      x - (x %% round.val)
    }
  }
}



if (length(wells_in_area) > 0){

  flood_warning <-
    if ((dd <= 15) && (input$flood == 'No')) {
      'but may be vulnerable to nitrate and pathogens'
    } else {
      ''
    }

  if ((input$colo == 'Black' | input$utensil == "No colour change to slightly blackish")) {

    warning_severity = if (dd > 150) 'HIGHLY' else ''

    paste ("Your tubewell is", warning_severity, "likely to be arsenic-safe", flood_warning)

  } else if ((input$colo == 'Red' | input$utensil == "Red")) {

    if ((dd <= 15) && (input$colo == "Red") && (as_median_under_90 >= 20)) {
      paste ("in", pollution_status_under_90, chem_test, round.choose (lower_quantile_under_90, 10,1), "to", round.choose (upper_quantile_under_90, 10,1),"µg/L ")
    } else if (dd < 90){
      paste ("Your tubewell is", pollution_status_under_90, chem_test, round.choose (lower_quantile_under_90, 10,1), "to", round.choose (upper_quantile_under_90, 10,1),"µg/L ")
    } else if (dd <=150) {
      if (as_mean_over_90 >= 50) {
        paste ("Your tubewell is highly likely to be Polluted.")
      } else if (as_mean_over_90 < 50) {
        paste ("Your tubewell may be arsenic-safe.")
      }
    } else {
      paste ("Your tubewell is HIGHLY likely to be arsenic-safe")
    }

  }
} else {
  paste("We are unable to assess your tubewell with the information you supplied, please fill all the sections")
}
