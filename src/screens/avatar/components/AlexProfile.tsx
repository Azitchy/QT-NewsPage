import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

export default function AlexProfile() {
  const [editing, setEditing] = useState<
    "profile" | "traits" | "interests" | null
  >(null);

  const [profile, setProfile] = useState({
    name: "Peter",
    about:
      "I am a friendly guy who is always delighted to lend a helping hand to others. Some people know me as a tech superhero, utilising my extraordinary abilities to tackle digital challenges and make the world a better place.",
    gender: "Male",
    dob: "1999-01-01",
    city: "London",
  });

  const traitsList = [
    "Kind",
    "Moody",
    "Bossy",
    "Charismatic",
    "Friendly",
    "Curious",
    "Wise",
    "Grumpy",
    "Stubborn",
    "Open-minded",
    "Sarcastic",
    "Shy",
    "Confident",
    "Sassy",
    "Diplomatic",
    "Assertive",
    "Funny",
    "Supportive",
    "Inspiring",
    "Patient",
    "Energetic",
  ];

  const interestsList = [
    "Sports",
    "Art",
    "AI",
    "Gaming",
    "Travel",
    "Crypto",
    "Music",
    "Nature",
    "Entrepreneurship",
    "Photography",
    "Food",
    "Science",
    "Film and TV",
    "Writing",
    "Health and Wellness",
    "Psychology",
    "Cars",
    "Astronomy",
    "Anime and Manga",
    "Pets and Animals",
    "Technology",
    "Meditation and Mindfulness",
  ];

  const [traits, setTraits] = useState(["Moody", "Curious", "Funny"]);
  const [interests, setInterests] = useState(["AI", "Crypto", "Cars"]);

  const toggleTag = (tag: any, list: any, setter: any) => {
    if (list.includes(tag)) {
      setter(list.filter((t: any) => t !== tag));
    } else {
      setter([...list, tag]);
    }
  };

  const cancelEdit = () => setEditing(null);
  const saveEdit = () => setEditing(null);

  return (
    <div className="p-0 bg-gray-100 min-h-screen space-y-6">
      <div className="font-h2">Profile</div>
      {/* PROFILE SECTION */}
      <div className="bg-white rounded-xl p-5">
        {editing !== "profile" && (
          <div className="flex justify-end mb-4">
            <Pencil
              size={18}
              className="cursor-pointer text-[#B5B5B5]"
              onClick={() => setEditing("profile")}
            />
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6">
          <img src="" className="w-75 h-75 rounded-[15px] object-cover" />

          <div className="flex-1 space-y-10">
            {editing === "profile" ? (
              <>
                <div>
                  <p className="text-sm mb-1">Name</p>
                  <input
                    className="w-full bg-gray-100 p-3 rounded-lg"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <p className="text-sm mb-1">About me</p>
                  <textarea
                    className="w-full bg-gray-100 p-3 rounded-lg"
                    rows={3}
                    value={profile.about}
                    onChange={(e) =>
                      setProfile({ ...profile, about: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm mb-1">Gender</p>

                    <select
                      className="w-full bg-gray-100 p-3 rounded-lg"
                      value={profile.gender}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Date of birth</p>
                    <input
                      type="date"
                      className="w-full bg-gray-100 p-3 rounded-lg"
                      value={profile.dob}
                      onChange={(e) =>
                        setProfile({ ...profile, dob: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-1">City</p>
                    <input
                      className="w-full bg-gray-100 p-3 rounded-lg"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[24px] text-foreground font-semibold">
                  {profile.name}
                </h2>
                <div>
                  <p className="text-[#4F5555] text-[14px]">About me</p>
                  <p className="text-foreground text-[16px] font-normal">
                    {profile.about}
                  </p>
                </div>

                <div className="flex justify-between xl:w-[50%] text-sm">
                  <div>
                    <p className="text-[#4F5555] text-[14px] font-normal">
                      Gender
                    </p>
                    <p className="text-foreground text-[16px]">
                      {profile.gender}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#4F5555] text-[14px] font-normal">
                      Date of birth
                    </p>
                    <p className="text-foreground text-[16px]">{profile.dob}</p>
                  </div>

                  <div>
                    <p className="text-[#4F5555] text-[14px] font-normal">
                      City
                    </p>
                    <p className="text-foreground text-[16px]">
                      {profile.city}
                    </p>
                  </div>
                </div>
              </>
            )}

            {editing === "profile" && (
              <div className="flex justify-end gap-3 pt-4">
                <div className="p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] inline-block">
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-white rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <button
                  onClick={saveEdit}
                  className="px-6 py-2 bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] text-white rounded-full cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TRAITS SECTION */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-medium">Traits of character</h3>
          {editing !== "traits" && (
            <Pencil
              size={18}
              className="cursor-pointer text-[#B5B5B5]"
              onClick={() => setEditing("traits")}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {traitsList.map((trait) => {
            const active = traits.includes(trait);

            return (
              <div
                key={trait}
                onClick={() =>
                  editing === "traits" && toggleTag(trait, traits, setTraits)
                }
                className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 cursor-pointer
                ${
                  active
                    ? "border border-purple-500"
                    : "bg-[#EBEBEB] text-foreground"
                }`}
              >
                {trait}

                {editing === "traits" && active && (
                  <X
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(trait, traits, setTraits);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {editing === "traits" && (
          <div className="flex justify-end gap-3 pt-5">
            <div className="p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] inline-block">
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-white rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={saveEdit}
              className="px-6 py-2 bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] text-white rounded-full cursor-pointer"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* INTERESTS SECTION */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-medium">Interests</h3>

          {editing !== "interests" && (
            <Pencil
              size={18}
              className="cursor-pointer text-[#B5B5B5]"
              onClick={() => setEditing("interests")}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {interestsList.map((item) => {
            const active = interests.includes(item);

            return (
              <div
                key={item}
                onClick={() =>
                  editing === "interests" &&
                  toggleTag(item, interests, setInterests)
                }
                className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 cursor-pointer
                ${
                  active
                    ? "border border-purple-500"
                    : "bg-[#EBEBEB] text-foreground"
                }`}
              >
                {item}

                {editing === "interests" && active && (
                  <X
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(item, interests, setInterests);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {editing === "interests" && (
          <div className="flex justify-end gap-3 pt-5">
            <div className="p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] inline-block">
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-white rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={saveEdit}
              className="px-6 py-2 bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] text-white rounded-full cursor-pointer"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
