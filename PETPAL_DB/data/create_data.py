from faker import Faker 
from uuid import uuid4
import pandas as pd 
import datetime
import random
import os 


'''
RUN THIS SCRIPT TO GENERATE FAKE DATA FOR THE DATABASE.
python .\PETPAL_DB\data\create_data.py
'''

# total number of users - half User and half Agency 
COUNT = 30  
# number of requests for events, sitting and adoption each
REQUEST_COUNT = 5 
# total number of pets randomly assigned 
PET_COUNT = 10
# total number of interests for each events, sitting and adoption request 
INTEREST_COUNT = 2

ROLES = ["user" , "agency"]
DIR = os.path.join(os.getcwd(),"PETPAL_DB", "data" , "csv")


if __name__=="__main__": 

    os.makedirs(DIR, exist_ok=True)
    fake = Faker()
    print(DIR)

    userdf = pd.DataFrame(columns=["userid" , "Name", "Email", "Phonenumber", "CreatedAt", "updatedAt", 'Bio' , "IsAgency", "Address", "LicenseNumber", "ImageUrl"])
    agencydf = pd.DataFrame(columns=["userid" , "Address", "LicenseNumber"])
    number = COUNT//2 

    BIO = [
    "I am a proud pet enthusiast who loves every moment with my furry friends.",
    "As a cat mom, my life revolves around my playful kittens.",
    "Being an animal lover means my heart is full of affection for all creatures.",
    "I’m a devoted dog mom who cherishes every wag of the tail.",
    "As a pet enthusiast, I love sharing tips on caring for animals.",
    "Being an animal lover, I always advocate for adopting pets in need.",
    "I consider myself a cat lover, always ready to spoil my feline companions.",
    "As a passionate pet owner, I enjoy exploring pet-friendly places.",
    "I’m a proud dog lover, and my pup is my best friend.",
    "Being a dedicated animal enthusiast, I enjoy learning about wildlife conservation."
    ]
    
    # normal users 
    for i in range(number):
        phone_number = str(random.randint(11111111, 99999999))
        bio = random.choice(BIO)
        userdf.loc[len(userdf)] = {"userid" :str(uuid4()), "Name": fake.name(), "Email": fake.email(), "PhoneNumber": "65"+phone_number, "Bio" : bio, "IsAgency": False ,"ImageUrl" : None , "CreatedAt": datetime.datetime.now(), "updatedAt": datetime.datetime.now()}
        # userdf.loc[len(userdf)] = {"map_id" :len(userdf), "Name": fake.name(), "Email": fake.email(), "Phonenumber": "65"+phone_number, "Role": "user", "Bio" : bio, "IsAgency": False}
    
    # TODO add user get UUID? 

    AGENCY_FIRST = [
    "Pawsitive",
    "Furry Friends",
    "Pet Paradise",
    "Purrfect",
    "Pet Haven",
    "Whisker Wonders",
    "Tail Waggers",
    "Critter Comforts",
    "Animal Allies",
    "Canine Companions"
    ]

    AGENCY_SECOND = [
        "Care Crew",
        "Pet Services",
        "Adventure Co.",
        "Companionship Agency",
        "Playtime Partners",
        "Luxury Retreat",
        "Wellness Hub",
        "Boarding Haven",
        "Grooming Lounge",
        "Training Academy"
    ]

    ADDRESS = [ 
    "1 Boon Leat Terrace, #07-02, Harbourside Building 1 Singapore 119843",
    "1 North Bridge Road, #07-02, High Street Centre Singapore 179094",
    "1 Changi Business Park Crescent, #07-02, Plaza 8 Singapore 486025",
    "1 HarbourFront Avenue, #07-02, HarbourFront Tower 1 Singapore 099253",
    "1 Fusionopolis Place, #07-02, Galaxis Singapore 138522",
    "1 HarbourFront Walk, #07-02, VivoCity Singapore 098585",
    "1 Raffles Boulevard, #07-02, Marina Square Singapore 039595",
    "1 Commonwealth Lane, #07-02, The Metropolis Singapore 149556",
    "1 Kallang Way, #07-02, Aperia Singapore 339156",
    "1 Bukit Batok Crescent, #07-02, The Synergy Singapore 658064"  
    ]

    AGENCY_BIO = [
    "We are a team of dedicated pet lovers who provide top-notch care for your furry friends.",
    "Our agency is committed to ensuring your pets receive the best care and attention."
    ]

    # agency users
    for i in range(number): 
        phone_number = str(random.randint(11111111, 99999999))
        agency_name = random.choice(AGENCY_FIRST) + " " + random.choice(AGENCY_SECOND)
        address = random.choice(ADDRESS)
        bio = random.choice(AGENCY_BIO)
        license_number = str(random.randint(111111111, 999999999))
        id = str(uuid4())
        userdf.loc[len(userdf)] = {"userid" : id, "Name": agency_name, "Email": fake.email(), "PhoneNumber": "65"+phone_number,  "Bio":bio, "isAgency": True , "Address": address, "LicenseNumber": license_number, "ImageUrl" : None , "CreatedAt": datetime.datetime.now(), "updatedAt": datetime.datetime.now()}
        agencydf.loc[len(agencydf)] = {"userid" : id , "Address": address, "LicenseNumber": license_number}

    # add pets 
    petdf = pd.DataFrame(columns=["Id" , "OwnerId" , "Name", "Age", "Sex", "Species" , "Breed" , "CreatedAt", "ImageUrl"])
    id_range = len(userdf)
    SPECIES = {
        "Dog": "German Shepherd",
        "Cat": "Siamese",
        "Bird": "Cockatiel",
        "Fish": "Betta Fish",
        "Rabbit": "Holland Lop",
        "Hamster": "Syrian Hamster",
        "Guinea Pig": "Abyssinian Guinea Pig",
        "Turtle": "Red-Eared Slider",
        "Snake": "Ball Python",
        "Lizard": "Bearded Dragon",
        "Frog": "African Bullfrog"
    }    
    SEX = ["male", "female"]
    PET_NAMES = [
    "Buddy",
    "Max",
    "Charlie",
    "Cooper",
    "Daisy",
    "Lucy",
    "Bailey",
    "Molly",
    "Sadie"
    ]
    user_onlydf = userdf[userdf["IsAgency"]==False]

    for i in range(PET_COUNT):
        # user_id = random.choice(user_onlydf["userid"].tolist())
        user_id = random.choice(userdf["userid"].tolist())
        pet_name = random.choice(PET_NAMES)
        age = random.randint(1, 20)
        species = random.choice(list(SPECIES.keys()))
        breed = SPECIES[species]
        sex = random.choice(SEX)
        petdf.loc[len(petdf)] = {"Id": str(uuid4()), "OwnerId" :user_id, "Name": pet_name, "Age": age, "Species": species, "Breed": breed,  "Sex": sex, "Imageurl": None, "CreatedAt": datetime.datetime.now()}

    
    
    STATUS = ["pending", "decided"]
    DESCRIPTIONS = [
    "Looking for a sitter for a weekend trip.",
    "Need a pet sitter for my cat while on vacation.",
    "Looking for someone to take care of my dog during a business trip.",
    "Need a temporary pet sitter for a week.",
    "Pet sitter needed while we move houses.",
    ]   
    
    TASK_TYPES = ['day_boarding', 'doggy_day_care', 'dog_walking', 'home_visits', 'house_sitting']

    ADDRESS = [ 
    "1 Boon Leat Terrace, #07-02, Harbourside Building 1 Singapore 119843",
    "1 North Bridge Road, #07-02, High Street Centre Singapore 179094",
    "1 Changi Business Park Crescent, #07-02, Plaza 8 Singapore 486025",
    "1 HarbourFront Avenue, #07-02, HarbourFront Tower 1 Singapore 099253",
    "1 Fusionopolis Place, #07-02, Galaxis Singapore 138522",
    "1 HarbourFront Walk, #07-02, VivoCity Singapore 098585",
    "1 Raffles Boulevard, #07-02, Marina Square Singapore 039595",
    "1 Commonwealth Lane, #07-02, The Metropolis Singapore 149556",
    "1 Kallang Way, #07-02, Aperia Singapore 339156",
    "1 Bukit Batok Crescent, #07-02, The Synergy Singapore 658064"  
    ]
    PINCODES = [
    "119843",
    "179094",
    "486025",
    "099253",
    "138522",
    "098585",
    "039595",
    "149556",
    "339156",
    "658064"
    ]


    # add sitting 
    # sittingdf = pd.DataFrame(columns=["Id", "UserId" , "Pay" ,  "StartDate", "EndDate", "status", "CreatedAt" , "Description", "Location"])
    sittingdf = pd.DataFrame(columns=["Id", "UserId" , "Pay" ,  "StartDate", "EndDate", "status", "CreatedAt" , "Description", "Location", "TaskType"])
    pet_sitting_df = pd.DataFrame(columns=["Id", "SittingRequestId", "PetId"])

    i = 0
    while i < REQUEST_COUNT:
        random_map_id = random.choice(petdf["OwnerId"].tolist())
        pets_for_sitting_df = petdf[petdf["OwnerId"] == random_map_id]

        # Check if there are pets associated with the selected OwnerId
        if pets_for_sitting_df.empty:
            print(f"No pets found for OwnerId {random_map_id}, skipping this iteration.")
            continue  # Skip to the next iteration without adding to DataFrame
        
        petid = random.choice(pets_for_sitting_df["Id"].tolist())
        pay = random.randint(5, 100)
        start_date = datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 30))
        end_date = start_date + datetime.timedelta(days=random.randint(1, 30))
        status = random.choice(STATUS)
        description = random.choice(DESCRIPTIONS)
        tasktype = random.choice(TASK_TYPES)
        sittingid = str(uuid4())
        location = random.choice(PINCODES)

        # Adding the sitting request to sittingdf
        sittingdf.loc[len(sittingdf)] = {
            "Id": sittingid,
            "UserId": random_map_id,
            "Pay": pay,
            "StartDate": start_date,
            "EndDate": end_date,
            "Status": status,
            "Description": description,
            "CreatedAt": datetime.datetime.now(),
            "Location": location,
            "TaskType": tasktype
        }
        
        # Adding the sitting request and pet relationship to pet_sitting_df
        pet_sitting_df.loc[len(pet_sitting_df)] = {
            "Id": str(uuid4()), 
            "SittingRequestId": sittingid, 
            "PetId": petid
        }
        i += 1  # Increment only when a valid entry is added

    # add interest
    sitting_interestdf = pd.DataFrame(columns=["Id", "UserId", "SittingRequestId", "CreatedAt" , "Status"])
    
    for i in range(len(sittingdf)):
        poster_id = sittingdf.iloc[i]["UserId"]
        for j in range(INTEREST_COUNT):
            sitting_id = sittingdf.iloc[i]["Id"]
            user_map_id = random.choice([map_id for map_id in user_onlydf["userid"].tolist() if map_id != poster_id])
            sitting_interestdf.loc[len(sitting_interestdf)] = {"Id": str(uuid4()), "UserId": user_map_id, "SittingRequestId": sitting_id}

    # add events 
    eventdf = pd.DataFrame(columns=["Id", "CreatedBy", "Event_name", "Description" , "Location", "StartDate", "CreatedAt", "Cost", "ImageUrl", "Status"])

    EVENTS = {
    "Pet Adoption Drive" : "Come and meet our pets at our adoption drive.",
    "Pet Grooming Workshop" : "Join us for a pet grooming workshop.",
    "Pet Training Workshop" : "Learn how to train your pet at woodlands" ,
    "Pet Friendly Picnic" : "Join us for a pet friendly picnic.",
    "Pet Friendly Movie Night" :"Join us for a pet friendly movie night.",
    "Pet Friendly Yoga" : "Join us for a pet friendly yoga session.",
    "Pet Friendly Hike" : "Join us for a pet friendly hike.",
    }


    for i in range(REQUEST_COUNT):
        random_map_id = random.choice(userdf["userid"].tolist())
        name = random.choice(list(EVENTS.keys()))
        description = EVENTS[name]
        location = random.choice(ADDRESS)
        cost = random.randint(5, 100)
        status = random.choice(STATUS)
        start_date = datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 30))
        end_date = start_date + datetime.timedelta(days=random.randint(1, 30))
        eventdf.loc[len(eventdf)] = {"Id": str(uuid4()), "CreatedBy" :random_map_id, "Event_name": name, "Location": location, "StartDate": start_date, "Description": description, "Cost": cost, "Status" : status, "CreatedAt": datetime.datetime.now(), "ImageUrl": None}


    # add event interest 
    event_interestdf = pd.DataFrame(columns=["Id", "UserId", "EventId", "CreatedAt" , "Status"])

    for i in range(len(eventdf)):
        for j in range(INTEREST_COUNT):
            event_id = eventdf.iloc[i]["Id"]
            user_map_id = random.choice(user_onlydf["userid"].tolist())
            event_interestdf.loc[len(event_interestdf)] = {"Id": str(uuid4()), "UserId": user_map_id, "EventId": event_id, "CreatedAt": datetime.datetime.now()}

    # add adoption 
    adoptiondf = pd.DataFrame(columns=["Id", "AgentId", "PetId", "Description", "Status", "CreatedAt", "UpdatedAt"])
    ADOPTION_DESCRIPTIONS = [
    "Looking for a new home for this cute pet.",
    "Adopt this pet and give it a loving home.",
    "Adopt this pet and give it a forever home.",
    "Looking for a loving family for this pet.",
    "Looking for a new family for this pet.",
    ]

    # Get initial list of available pet IDs where OwnerId is in agencydf["userid"]
    available_pets = petdf[petdf["OwnerId"].isin(agencydf["userid"].tolist())]["Id"].tolist()
    # Initialize a set to store used pet_id values
    used_pet_ids = set()

    for i in range(REQUEST_COUNT):
        random_map_id = random.choice(agencydf["userid"].tolist())

        # Get available pet IDs by excluding the used ones from the initial available_pets
        available_pet_ids = list(set(available_pets) - used_pet_ids)
        if not available_pet_ids:
            print("No more unique pet IDs available, stopping.")
            break  # Stop the loop if there are no available pet IDs
        # Select a random pet ID from the available ones
        pet_id = random.choice(available_pet_ids)

        # Add the selected pet_id to the used_pet_ids set
        used_pet_ids.add(pet_id)
        description = random.choice(ADOPTION_DESCRIPTIONS)
        status = random.choice(STATUS)
        adoptiondf.loc[len(adoptiondf)] = {"Id": str(uuid4()), "AgentId" :random_map_id, "PetId": pet_id, "Description": description, "Status": status, "CreatedAt": datetime.datetime.now(), "UpdatedAt": datetime.datetime.now()}

    # add adoption interest
    adoption_interestdf = pd.DataFrame(columns=["Id", "UserId", "AdoptionListingId", "Createdat" , "Status"])
    
    for i in range(len(adoptiondf)):
        for j in range(INTEREST_COUNT):
            adoption_id = adoptiondf.iloc[i]["Id"]
            user_map_id = random.choice(user_onlydf["userid"].tolist())
            adoption_interestdf.loc[len(adoption_interestdf)] = {"Id": str(uuid4()), "UserId": user_map_id, "AdoptionListingId": adoption_id, "CreatedAt": datetime.datetime.now(), "Status": "pending"}

    userdf.to_csv(os.path.join(DIR, "user.csv"), index=False)
    # agencydf.to_csv(os.path.join(DIR, "agency.csv"), index=False)
    petdf.to_csv(os.path.join(DIR, "pet.csv"), index=False)
    sittingdf.to_csv(os.path.join(DIR, "sitting.csv"), index=False)
    sitting_interestdf.to_csv(os.path.join(DIR, "sitting_interest.csv"), index=False)
    pet_sitting_df.to_csv(os.path.join(DIR, "pet_sitting_request.csv"), index=False)
    eventdf.to_csv(os.path.join(DIR, "event.csv"), index=False)
    event_interestdf.to_csv(os.path.join(DIR, "event_interest.csv"), index=False)
    adoptiondf.to_csv(os.path.join(DIR, "adoption.csv"), index=False)
    adoption_interestdf.to_csv(os.path.join(DIR, "adoption_interest.csv"), index=False)




