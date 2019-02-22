round.concentration <- function() {
  low_value <- lower_quantile + (10 - lower_quantile %% 10)
  high_value <- upper_quantile + (10 - upper_quantile %% 10)
  if(is.na(low_value) | is.na(high_value)) { concen_output <- '(No data currently available)') 
  } else if(low_value == high_value){
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