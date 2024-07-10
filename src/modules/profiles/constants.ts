enum BirthdayMarkerEnum {
  Standard = 0, // Date follows global standard
  WithoutYear = 1, // Date without year
}

enum ProfilesOrderEnum {
  NoOrder = 0,
  UpcomingBirthday = 1,
}

const DUMMY_LEAP_YEAR = 1200;

export { BirthdayMarkerEnum, ProfilesOrderEnum, DUMMY_LEAP_YEAR };
