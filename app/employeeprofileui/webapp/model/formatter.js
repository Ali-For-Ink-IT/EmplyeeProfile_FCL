sap.ui.define([], function () {
	"use strict";

	// console.log("📦 formatter module loaded");

	return {
		getFullName: function (employmentNav) {
			// console.log("✅ formatter.getFullName called", employmentNav);

			try {
				const info = employmentNav?.personNav?.personalInfoNav?.[0];
				if (info) {
					return `${info.firstName || ""} ${info.middleName || ""} ${info.lastName || ""}`.trim();
				}
			} catch (e) {
				console.warn("Full name extraction failed", e);
			}
			return "Unknown";
		},

		getPhotoSrc: function (photoNavArray) {
			console.log("📸 getPhotoSrc called with:", photoNavArray);
		  
			try {
			  const photoObj = Array.isArray(photoNavArray) ? photoNavArray[0] : photoNavArray;
			  if (photoObj?.photo && photoObj?.mimetype) {
				const result = `data:${photoObj.mimetype};base64,${photoObj.photo}`;
				console.log("✅ Returning photo src:", result);
				return result;
			  }
			} catch (e) {
			  console.warn("❌ Error in getPhotoSrc", e);
			}
			return null;
		  },

		  getOffDaysFromWorkSchedule: function (startingDateStr, workScheduleDayModels) {
			if (!startingDateStr || !Array.isArray(workScheduleDayModels)) {
				console.warn("Invalid input: startingDateStr or workScheduleDayModels is missing or not an array.");
				return "";
			}
		
			try {
				const startingDate = new Date(startingDateStr + 'T00:00:00Z');
				const startDay = startingDate.getUTCDay();
		
				// Create SAP → JS day mapping
				const dayMap = {};
				for (let i = 1; i <= 7; i++) {
					dayMap[i] = (startDay + (i - 1)) % 7;
				}
		
				const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		
				const offDays = workScheduleDayModels
					.filter(d => d && d.category === 'OFF' && d.day != null)
					.map(d => {
						const jsDay = dayMap[parseInt(d.day, 10)];
						return {
							jsDay,
							dayName: dayNames[jsDay]
						};
					});
		
				return offDays.map(d => d.dayName).join(", ");
			} catch (error) {
				console.error("Error in getOffDaysFromWorkSchedule:", error);
				return "";
			}
		},
		
		getOffDaysFromWorkSchedule1:  function(startingDateStr, workScheduleDayModels) {
			
			const startingDate = new Date(startingDateStr + 'T00:00:00Z');
			const startDay = startingDate.getUTCDay(); 
		  
			// Create SAP → JS day mapping
			const dayMap = {};
			for (let i = 1; i <= 7; i++) {
			  dayMap[i] = (startDay + (i - 1)) % 7;
			}
		  
			// Map JS day index to readable name
			const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		  
			// Filter OFF days
			const offDays = workScheduleDayModels
			  .filter(d => d.category === 'OFF')
			  .map(d => {
				const jsDay = dayMap[parseInt(d.day, 10)];
				return {
				  jsDay,
				  dayName: dayNames[jsDay]
				};
			  });
			  
			  return offDays.map(d => d.dayName).join(", ");

			return offDays;
		  }
		  
		  
	};
});
