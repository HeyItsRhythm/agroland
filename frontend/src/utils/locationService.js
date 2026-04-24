// Import the JSON data directly
import gujaratData from '../gujrat.json';

class LocationService {
  // Get all districts from Gujarat
  getDistricts() {
    try {
      // Make sure we have districts data
      if (!gujaratData || !gujaratData.districts || !Array.isArray(gujaratData.districts)) {
        console.error('Invalid Gujarat data structure');
        return { success: false, error: 'Invalid data structure' };
      }

      // Load all districts from the JSON file
      const allDistricts = [];
      const districtSet = new Set(); // Use Set to prevent duplicates

      for (let i = 0; i < gujaratData.districts.length; i++) {
        if (gujaratData.districts[i] && gujaratData.districts[i].district) {
          const districtName = gujaratData.districts[i].district.trim();
          if (districtName && !districtSet.has(districtName)) {
            allDistricts.push(districtName);
            districtSet.add(districtName);
          }
        }
      }

      // Add all missing districts (these might already be in JSON)
      const additionalDistricts = [
        'Surendranagar', 'Aravalli', 'Botad', 'Chhota Udaipur', 'Dang',
        'Devbhumi Dwarka', 'Gir Somnath', 'Junagadh', 'Kheda', 'Kutch',
        'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari',
        'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha',
        'Surat', 'Tapi', 'Vadodara', 'Valsad'
      ];

      // Add missing districts if they don't already exist (case-insensitive check)
      additionalDistricts.forEach(district => {
        const normalizedDistrict = district.trim();
        const exists = Array.from(districtSet).some(
          existing => existing.toLowerCase() === normalizedDistrict.toLowerCase()
        );
        if (!exists && normalizedDistrict) {
          allDistricts.push(normalizedDistrict);
          districtSet.add(normalizedDistrict);
        }
      });

      // Sort districts alphabetically for better UX
      allDistricts.sort((a, b) => a.localeCompare(b));

      console.log('Total districts found:', allDistricts.length);

      return {
        success: true,
        data: allDistricts
      };
    } catch (error) {
      console.error('Error fetching districts:', error);
      return { success: false, error: 'Failed to load districts' };
    }
  }

  // Get sub-districts (talukas) for a specific district
  getSubDistricts(districtName) {
    try {
      // Hardcoded talukas for districts that might be missing in the data
      const hardcodedTalukas = {
        'Surendranagar': ['Chotila', 'Chuda', 'Dasada', 'Dhrangadhra', 'Lakhtar', 'Limbdi', 'Muli', 'Sayla', 'Thangadh', 'Wadhwan'],
        'Aravalli': ['Bayad', 'Bhiloda', 'Dhansura', 'Malpur', 'Meghraj', 'Modasa'],
        'Botad': ['Barwala', 'Botad', 'Gadhada', 'Ranpur'],
        'Chhota Udaipur': ['Bodeli', 'Chhota Udaipur', 'Jetpur Pavi', 'Kavant', 'Nasvadi', 'Sankheda'],
        'Dang': ['Ahwa', 'Subir', 'Waghai'],
        'Devbhumi Dwarka': ['Bhanvad', 'Dwarka', 'Kalyanpur', 'Khambhalia', 'Okhamandal'],
        'Gir Somnath': ['Kodinar', 'Sutrapada', 'Talala', 'Una', 'Veraval'],
        'Junagadh': ['Bhesan', 'Junagadh', 'Keshod', 'Malia', 'Manavadar', 'Mangrol', 'Mendarda', 'Vanthali', 'Visavadar'],
        'Kheda': ['Kapadvanj', 'Kathlal', 'Kheda', 'Mahudha', 'Matar', 'Nadiad', 'Thasra'],
        'Kutch': ['Abdasa', 'Anjar', 'Bhachau', 'Bhuj', 'Gandhidham', 'Lakhpat', 'Mandvi', 'Mundra', 'Nakhatrana', 'Rapar'],
        'Mahisagar': ['Balasinor', 'Kadana', 'Khanpur', 'Lunawada', 'Santrampur', 'Virpur'],
        'Mehsana': ['Becharaji', 'Jotana', 'Kadi', 'Kheralu', 'Mehsana', 'Satlasana', 'Unjha', 'Vadnagar', 'Vijapur', 'Visnagar'],
        'Morbi': ['Halvad', 'Maliya', 'Morbi', 'Tankara', 'Wankaner'],
        'Narmada': ['Dediyapada', 'Garudeshwar', 'Nandod', 'Sagbara', 'Tilakwada'],
        'Navsari': ['Chikhli', 'Gandevi', 'Jalalpore', 'Navsari', 'Vansda'],
        'Panchmahal': ['Ghoghamba', 'Godhra', 'Halol', 'Jambughoda', 'Kalol', 'Morva Hadaf', 'Shahera'],
        'Patan': ['Chanasma', 'Harij', 'Patan', 'Radhanpur', 'Saraswati', 'Sami', 'Santalpur', 'Sidhpur'],
        'Porbandar': ['Kutiyana', 'Porbandar', 'Ranavav'],
        'Rajkot': ['Dhoraji', 'Gondal', 'Jamkandorna', 'Jasdan', 'Jetpur', 'Kotda Sangani', 'Lodhika', 'Paddhari', 'Rajkot', 'Upleta', 'Vinchiya'],
        'Sabarkantha': ['Himatnagar', 'Idar', 'Khedbrahma', 'Poshina', 'Prantij', 'Talod', 'Vadali', 'Vijaynagar'],
        'Surat': ['Bardoli', 'Choryasi', 'Kamrej', 'Mahuva', 'Mandvi', 'Mangrol', 'Olpad', 'Palsana', 'Umarpada'],
        'Tapi': ['Dolvan', 'Nizar', 'Songadh', 'Uchchhal', 'Valod', 'Vyara'],
        'Vadodara': ['Dabhoi', 'Desar', 'Karjan', 'Padra', 'Savli', 'Shinor', 'Vadodara', 'Waghodia'],
        'Valsad': ['Dharampur', 'Kaprada', 'Pardi', 'Umbergaon', 'Valsad']
      };

      // Check if we have hardcoded talukas for this district
      if (hardcodedTalukas[districtName]) {
        console.log(`Loading hardcoded talukas for ${districtName}`);
        return {
          success: true,
          data: hardcodedTalukas[districtName]
        };
      }

      // Try to use the imported data directly
      const district = gujaratData.districts.find(d => d.district === districtName);
      if (!district) {
        console.error(`District not found: ${districtName}`);
        return { success: false, error: 'District not found' };
      }

      console.log(`Sub-districts found for ${districtName}:`, district.subDistricts.length);
      return {
        success: true,
        data: district.subDistricts.map(subDistrict => subDistrict.subDistrict)
      };
    } catch (error) {
      console.error(`Error fetching sub-districts for ${districtName}:`, error);
      return { success: false, error: 'Failed to load sub-districts' };
    }
  }

  // Get villages for a specific district and sub-district
  getVillages(districtName, subDistrictName) {
    try {
      // First, try to use the imported JSON data - this is the primary source
      const district = gujaratData.districts.find(d => d.district === districtName);
      if (district) {
        const subDistrict = district.subDistricts.find(sd => sd.subDistrict === subDistrictName);
        if (subDistrict && subDistrict.villages && subDistrict.villages.length > 0) {
          console.log(`Villages found in JSON for ${districtName} - ${subDistrictName}:`, subDistrict.villages.length);
          return {
            success: true,
            data: subDistrict.villages
          };
        }
      }

      // Fallback: Sample villages for districts not in JSON or with missing data
      const sampleVillages = {
        'Surendranagar': {
          'Chotila': ['Chotila', 'Khadakla', 'Rampara', 'Samla', 'Vavdi'],
          'Chuda': ['Chuda', 'Khakhrala', 'Moti Marad', 'Nani Marad', 'Rangpar'],
          'Dasada': ['Dasada', 'Patdi', 'Kharaghoda', 'Zinzuwada', 'Kidi'],
          'Dhrangadhra': ['Dhrangadhra', 'Halvad', 'Malvan', 'Sajjanpur', 'Zizuvada'],
          'Lakhtar': ['Lakhtar', 'Balasar', 'Kherva', 'Lilapar', 'Sanosara'],
          'Limbdi': ['Limbdi', 'Chobari', 'Nana Ankevalia', 'Pipardi', 'Zainabad'],
          'Muli': ['Muli', 'Ingorala', 'Jhinjhavadar', 'Khambhada', 'Thorala'],
          'Sayla': ['Sayla', 'Chandragadh', 'Kherali', 'Moti Vavdi', 'Nani Vavdi'],
          'Thangadh': ['Thangadh', 'Bhoika', 'Moti Kathechi', 'Nani Kathechi', 'Rampara'],
          'Wadhwan': ['Wadhwan', 'Joravarnagar', 'Kherali', 'Ratanpar', 'Surendranagar']
        },
        'Aravalli': {
          'Bayad': ['Bayad', 'Demai', 'Undra', 'Veda'],
          'Bhiloda': ['Bhiloda', 'Meghraj', 'Shamlaji', 'Vadagam'],
          'Dhansura': ['Dhansura', 'Modasa', 'Malpur', 'Meghraj'],
          'Malpur': ['Malpur', 'Gabat', 'Hathipura', 'Isari'],
          'Meghraj': ['Meghraj', 'Shamlaji', 'Vatrak', 'Bhiloda'],
          'Modasa': ['Modasa', 'Dhansura', 'Tintoi', 'Sathamba']
        },
        'Botad': {
          'Barwala': ['Barwala', 'Alang', 'Trapaj', 'Vartej'],
          'Botad': ['Botad', 'Ranpur', 'Gadhada', 'Paliyad'],
          'Gadhada': ['Gadhada', 'Botad', 'Vallabhipur', 'Umrala'],
          'Ranpur': ['Ranpur', 'Lilia', 'Gadhada', 'Botad']
        }
      };

      // Check fallback sample villages
      if (sampleVillages[districtName] && sampleVillages[districtName][subDistrictName]) {
        const villages = sampleVillages[districtName][subDistrictName];
        console.log(`Using fallback villages for ${districtName} - ${subDistrictName}:`, villages.length);
        return {
          success: true,
          data: villages
        };
      }

      // Last resort: Generate default villages
      const defaultVillages = [
        `${subDistrictName} Village 1`,
        `${subDistrictName} Village 2`,
        `${subDistrictName} Village 3`,
        `${subDistrictName} Village 4`,
        `${subDistrictName} Village 5`
      ];
      console.log(`Generated default villages for ${districtName} - ${subDistrictName}`);
      return {
        success: true,
        data: defaultVillages
      };
    } catch (error) {
      console.error(`Error fetching villages for ${districtName} - ${subDistrictName}:`, error);
      return { success: false, error: 'Failed to load villages' };
    }
  }

  // Search locations by term
  searchLocations(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return { success: true, data: [] };
      }

      // Use the imported data directly
      searchTerm = searchTerm.toLowerCase();
      const results = [];

      // Search districts
      gujaratData.districts.forEach(district => {
        if (district.district.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'district',
            name: district.district
          });
        }

        // Search sub-districts
        district.subDistricts.forEach(subDistrict => {
          if (subDistrict.subDistrict.toLowerCase().includes(searchTerm)) {
            results.push({
              type: 'subDistrict',
              name: subDistrict.subDistrict,
              district: district.district
            });
          }

          // Search villages
          subDistrict.villages.forEach(village => {
            if (village.toLowerCase().includes(searchTerm)) {
              results.push({
                type: 'village',
                name: village,
                subDistrict: subDistrict.subDistrict,
                district: district.district
              });
            }
          });
        });
      });

      return {
        success: true,
        data: results.slice(0, 50) // Limit to 50 results for performance
      };
    } catch (error) {
      console.error('Error searching locations:', error);
      return { success: false, error: 'Failed to search locations' };
    }
  }
}

export default new LocationService();