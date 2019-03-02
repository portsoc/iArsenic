args <- commandArgs(trailingOnly=TRUE)

# todo
# [ ] if we don't have enough data, go up

# the code currently has depth strata borders at 15 50 90 150
depth <- as.integer(args[5])

input <- data.frame(
  div = args[1],
  dis = args[2],
  upa = args[3],
  uni = args[4],
  colour = args[6],
  utensil = args[7],
  flood = args[8]
)

if (is.na(input$utensil)) input$utensil = ' '
if (is.na(input$flood)) input$flood = ' '

# we want to log into console, not simply return
paste <- cat

adm.files <- read.csv('data/AdmBnd1b.csv', header = T, stringsAsFactors=F)

df <- data.frame(div = c(adm.files$Division),
                 dis = c(adm.files$District),
                 upa = c(adm.files$Upazila),
                 uni = c(adm.files$Union),
                 stringsAsFactors = FALSE,
                 dep = c(adm.files$Depth),
                 asc = c(adm.files$Arsenic))

min_data_count = 7

#Selecting the wells data for the Upazila which are <90 m deep
wells_in_area <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa & df$uni == input$uni)

wells_under_90 <- which(df$dep[wells_in_area] < 90)
wells_over_90 <- which(df$dep[wells_in_area] >= 90)

if (depth < 90 & length(wells_under_90) < min_data_count) {
  # paste('up ', length(wells_under_90), ' ');
  wells_in_area <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)
  wells_under_90 <- which(df$dep[wells_in_area] < 90)

  if (length(wells_under_90) < min_data_count) {
    # paste('up ', length(wells_under_90), ' ');
    wells_in_area <- which(df$div == input$div & df$dis == input$dis)
    wells_under_90 <- which(df$dep[wells_in_area] < 90)

    if (length(wells_under_90) < min_data_count) {
      # paste('up ', length(wells_under_90), ' ');
      wells_in_area <- which(df$div == input$div)
      wells_under_90 <- which(df$dep[wells_in_area] < 90)

      if (length(wells_under_90) < min_data_count) {
        paste('not enough data ')
      }
    }
  }
}

if (depth >= 90 & length(wells_over_90) < min_data_count) {
  # paste('up ', length(wells_over_90), ' ');
  wells_in_area <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)
  wells_over_90 <- which(df$dep[wells_in_area] >= 90)

  if (depth >= 90 & length(wells_over_90) < min_data_count) {
    # paste('up ', length(wells_over_90), ' ');
    wells_in_area <- which(df$div == input$div & df$dis == input$dis)
    wells_over_90 <- which(df$dep[wells_in_area] >= 90)

    if (depth >= 90 & length(wells_over_90) < min_data_count) {
      # paste('up ', length(wells_over_90), ' ');
      wells_in_area <- which(df$div == input$div)
      wells_over_90 <- which(df$dep[wells_in_area] >= 90)

      if (length(wells_over_90) < min_data_count) {
        paste('not enough data ')
      }
    }
  }
}

#----new for shallow <90 m arsenic range
arsenic_under_90 <-(df$asc[wells_in_area][wells_under_90])
lower_quantile_under_90 <- quantile(arsenic_under_90, c(0.10), type = 1)
upper_quantile_under_90 <- quantile(arsenic_under_90, c(0.90), type = 1)
if (length(wells_under_90) == 0) { arsenic_under_90 = 0 }
as_median_under_90 <- median(arsenic_under_90)
as_max_under_90 <- max(arsenic_under_90)

#Selecting the wells data for the Upazila which are >90 m deep
arsenic_over_90 <- df$asc[wells_in_area][wells_over_90]
if (length(wells_over_90) == 0) { arsenic_over_90 = 0 }
as_mean_over_90 <- mean(arsenic_over_90)

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

  if ((input$colour == 'Black' | input$utensil == 'No colour change to slightly blackish')) {

    warning_severity = if (depth > 150) 'HIGHLY ' else ''

    flood_warning <-
      if ((depth <= 15) && (input$flood == 'No')) {
        ' but may be vulnerable to nitrate and pathogens'
      } else {
        ''
      }

    paste ('Your tubewell is ', warning_severity, 'likely to be arsenic-safe', flood_warning, sep='')

  } else if (input$colour == 'Red' | input$utensil == 'Red') {

    if (depth < 90){
      pollution_status <-
        if ((as_median_under_90 > 20) && (as_median_under_90 <= 50)) {
          'likely to be Polluted'
        } else if ((as_median_under_90 > 50) && (as_median_under_90 <= 200)) {
          'likely to be HIGHLY Polluted'
        } else if (as_median_under_90 > 200) {
          'likely to be SEVERELY Polluted'
        } else {
          'likely to be arsenic-safe'
        }

      chem_test_status <-
        if (as_max_under_90 <= 100) {
          'and concentration may be around'
        }else {
          ', a chemical test is needed as concentration can be high, ranging around'
        }

      paste ('Your tubewell is', pollution_status, chem_test_status, round.choose (lower_quantile_under_90, 10,1), 'to', round.choose (upper_quantile_under_90, 10,1),'µg/L ')

    } else if (depth <= 150) {
      if (as_mean_over_90 >= 50) {
        paste ('Your tubewell is highly likely to be Polluted.')
      } else if (as_mean_over_90 < 50) {
        paste ('Your tubewell may be arsenic-safe.')
      }

    } else {
      paste ('Your tubewell is HIGHLY likely to be arsenic-safe')
    }

  }
} else {
  paste('We are unable to assess your tubewell with the information you supplied, please fill all the sections')
}
