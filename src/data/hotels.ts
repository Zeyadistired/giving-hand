
import { Hotel } from "@/types";

export const hotels: Hotel[] = [
  { id: "HOT001", name: "The Nile Ritz-Carlton, Cairo" },
  { id: "HOT002", name: "Fairmont Nile City Hotel" },
  { id: "HOT003", name: "Kempinski Nile Hotel" },
  { id: "HOT004", name: "Sofitel Cairo Nile El Gezirah" },
  { id: "HOT005", name: "Marriott Mena House, Cairo" },
  { id: "HOT006", name: "Conrad Cairo Hotel & Casino" },
  { id: "HOT007", name: "Four Seasons Hotel Cairo at Nile Plaza" },
  { id: "HOT008", name: "Steigenberger Hotel El Tahrir" },
  { id: "HOT009", name: "InterContinental Cairo Semiramis" },
  { id: "HOT010", name: "Ramses Hilton" },
  { id: "HOT011", name: "Sheraton Cairo Hotel & Casino" },
  { id: "HOT012", name: "Le Méridien Cairo Airport" },
  { id: "HOT013", name: "Cairo Marriott Hotel & Omar Khayyam Casino" },
  { id: "HOT014", name: "Dusit Thani LakeView Cairo" },
  { id: "HOT015", name: "Novotel Cairo El Borg" },
  { id: "HOT016", name: "Hilton Cairo Zamalek Residences" },
  { id: "HOT017", name: "Triumph Luxury Hotel" },
  { id: "HOT018", name: "The Gabriel Hotel" },
  { id: "HOT019", name: "Baron Hotel Heliopolis" },
  { id: "HOT020", name: "Aracan Pyramids Hotel" },
  { id: "HOT021", name: "Giza Pyramids Inn" },
  { id: "HOT022", name: "Guardian Guest House" },
  { id: "HOT023", name: "Hayat Pyramids View Hotel" },
  { id: "HOT024", name: "Grand Nile Tower Hotel" },
  { id: "HOT025", name: "Sonesta Hotel Tower & Casino Cairo" },
  { id: "HOT026", name: "Cataract Pyramids Resort" },
  { id: "HOT027", name: "Le Passage Cairo Hotel & Casino" },
  { id: "HOT028", name: "Swiss Inn Nile Hotel" },
  { id: "HOT029", name: "Pyramids Park Resort Cairo" },
  { id: "HOT030", name: "Oasis Hotel Pyramids" },
  { id: "HOT031", name: "Mercure Cairo Le Sphinx Hotel" },
  { id: "HOT032", name: "Zayed Hotel" },
  { id: "HOT033", name: "Amarante Pyramids Hotel" },
  { id: "HOT034", name: "Grand Pyramids Hotel" },
  { id: "HOT035", name: "St. George Hotel" },
  { id: "HOT036", name: "Azar Hotel Cairo" },
  { id: "HOT037", name: "Bella Casa Hostel" },
  { id: "HOT038", name: "Osiris Hotel Cairo" },
  { id: "HOT039", name: "The Karvin Hotel" },
  { id: "HOT040", name: "Cleopatra Hotel" },
  { id: "HOT041", name: "Horus House Hotel Zamalek" },
  { id: "HOT042", name: "Indiana Hotel Cairo" },
  { id: "HOT043", name: "Havana Hotel Cairo" },
  { id: "HOT044", name: "Golden Tulip Flamenco Hotel Cairo" },
  { id: "HOT045", name: "Talisman Hotel de Charme" },
  { id: "HOT046", name: "Victoria Hotel Cairo" },
  { id: "HOT047", name: "Happy City Hotel" }
];

export const getHotelById = (id: string): Hotel | undefined => {
  return hotels.find(hotel => hotel.id === id);
};

export const getHotelByName = (name: string): Hotel | undefined => {
  return hotels.find(hotel => hotel.name.toLowerCase().includes(name.toLowerCase()));
};
