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
index <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)

# to avoid the problem of no shallow well in some areas
index_2 <- which(df$dep[index] < 90)

#----new for shallow <90 m arsenic range
df_asc <-(df$asc[index][index_2])
lower_quantile <- quantile(df_asc, c(0.10), type = 1)
upper_quantile <- quantile(df_asc, c(0.90), type = 1)
if (length(index_2) == 0){ df_asc = 0 } 
as_median <- median(df_asc)
as_max <- max(df_asc)

#Selecting the wells data for the Upazila which are >90 m deep
index_150 <- which(df$div == input$div & df$dis == input$dis & df$upa == input$upa)
index_2_150 <- which(df$dep[index_150] >= 90)
df_asc_150 <- df$asc[index_150][index_2_150]
if (length(index_2_150) == 0){ df_asc_150 = 0 } 
as_mean_150 <- mean(df_asc_150)

#the following three pieces of code decide the output message
Pol_stat<-if (((as_median)>20) && (((as_median)<=50))){"likely to be Polluted"
} else if (((as_median)>50) && (((as_median)<=200))){"likely to be HIGHLY Polluted"
} else if ((as_median)>200){"likely to be SEVERELY Polluted"
}else {"likely to be arsenic-safe"}

chem_test <- if ((as_max>=0)&&(as_max<=100)){"and concentration may be around"
}else {", a chemical test is needed as concentration can be high, ranging around"
}

#Pol_90 is declared here 
if (as_mean_150 >= 50) {Pol_90 <- "Your tubewell is highly likely to be Polluted."
} else if (as_mean_150 < 50) {Pol_90 <- "Your tubewell may be arsenic-safe."
}

round.concentration <- function() {
  low_value <- lower_quantile + (10 - lower_quantile %% 10)
  high_value <- upper_quantile + (10 - upper_quantile %% 10)
  if(is.na(low_value) | is.na(high_value)) { return('(No data currently available)') }  
  if(low_value == high_value){
    concen_output <- paste0(high_value, " µg/L")
  }else {
    concen_output <- paste0(low_value, ' to ', high_value, ' µg/L')
  }
}

#Assessment based on basement colour

if (length(index) > 0){
	flood_warning = ''
	if ((dd <= 15) && (input$flood == 'Yes')){ flood_warning = 'but may be vulnerable to nitrate and pathogens' }

	if ((input$colo == 'Black' | input$utensil == "No colour change to slightly blackish")) {
	  warning_severity = ''
	  if (dd > 150) { warning_severity = 'HIGHLY' }
	  paste ("Your tubewell is", warning_severity, "likely to be arsenic-safe", flood_warning)
	} else if ((input$colo == 'Red' | input$utensil == "Red")) {
	  if (dd < 90){
		paste ("Your tubewell is", Pol_stat, chem_test, round.concentration(), flood_warning)
	  } else if (dd <=150) {
			paste (Pol_90)
	  } else {
			paste ("Your tubewell is HIGHLY likely to be arsenic-safe")
	  }
	}
} else {
    paste("We are unable to assess your tubewell with the information you supplied, please fill all the sections")
}