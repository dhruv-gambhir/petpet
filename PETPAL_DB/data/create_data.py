from faker import Faker 
from uuid import uuid4
import pandas as pd 
import datetime
import random
import os 


'''
CHANGES: 

map_id : anything labelled as such or user_map_id is a name place for the UUID FK.
will need to insert and retrieve relevant UUID? is it generated in script or postgres?  

'''

# total number of users - half User and half Agency 
COUNT = 30  
# number of requests for events, sitting and adoption each
REQUEST_COUNT = 5 
# total number of pets randomly assigned 
PET_COUNT = 5
# total number of interests for each events, sitting and adoption request 
INTEREST_COUNT = 2

ROLES = ["user" , "agency"]
DIR = os.path.join(os.getcwd(),"PETPAL_DB", "data" , "csv")


if __name__=="__main__": 

    os.makedirs(DIR, exist_ok=True)
    fake = Faker()
    print(DIR)

    userdf = pd.DataFrame(columns=["map_id" , "Name", "Email", "Phonenumber", "Role", "CreatedAt", "updatedAt", 'Bio' , "IsAgency"])
    agencydf = pd.DataFrame(columns=["map_id" , "AgentId", "UserId", "Address", "LicenseNumber"])
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
        userdf.loc[len(userdf)] = {"map_id" :len(userdf), "Name": fake.name(), "Email": fake.email(), "Phonenumber": "65"+phone_number, "Role": "user", "Bio" : bio, "IsAgency": False}
    
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
        userdf.loc[len(userdf)] = {"map_id" :len(userdf), "Name": agency_name, "Email": fake.email(), "Phonenumber": "65"+phone_number, "Role": "agency",  "Bio":bio, "isAgency": True}
        agencydf.loc[len(agencydf)] = {"map_id" :len(userdf), "Address": address, "LicenseNumber": license_number}

    # add pets 
    petdf = pd.DataFrame(columns=["map_id" , "Name", "Age", "Sex", "Species" , "Breed" , "CreatedAt"])
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
    for i in range(PET_COUNT):
        user_id = random.randint(0, id_range)
        pet_name = random.choice(PET_NAMES)
        age = random.randint(1, 20)
        species = random.choice(list(SPECIES.keys()))
        breed = SPECIES[species]
        sex = random.choice(SEX)
        petdf.loc[len(petdf)] = {"map_id" :user_id, "Name": pet_name, "Age": age, "Species": species, "Breed": breed,  "Sex": sex}

    
    user_onlydf = userdf[userdf["Role"]=="user"]
    STATUS = ["pending", "decided"]
    DESCRIPTIONS = [
    "Looking for a sitter for a weekend trip.",
    "Need a pet sitter for my cat while on vacation.",
    "Looking for someone to take care of my dog during a business trip.",
    "Need a temporary pet sitter for a week.",
    "Pet sitter needed while we move houses.",
    ]   
    

    # add sitting 
    sittingdf = pd.DataFrame(columns=["sitting_id", "map_id" , "Pay" ,  "StartDate", "EndDate", "Status", "CreatedAt" , "Description"])
    for i in range(REQUEST_COUNT):
        random_map_id = random.choice(user_onlydf["map_id"].tolist())
        pay = random.randint(5, 100)
        start_date = datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 30))
        end_date = start_date + datetime.timedelta(days=random.randint(1, 30))
        status = random.choice(STATUS)
        description = random.choice(DESCRIPTIONS)
        sittingdf.loc[len(sittingdf)] = {"sitting_id": len(sittingdf), "map_id" :random_map_id, "Pay": pay, "StartDate": start_date, "EndDate": end_date, "Status": status,  "Description": description}


    # add interest
    sitting_interestdf = pd.DataFrame(columns=["interest_id", "user_map_id", "sitting_id", "CreatedAt" , "status"])
    
    for i in range(len(sittingdf)):
        poster_id = sittingdf.iloc[i]["map_id"]
        for j in range(INTEREST_COUNT):
            sitting_id = i  
            user_map_id = random.choice([map_id for map_id in user_onlydf["map_id"].tolist() if map_id != poster_id])
            sitting_interestdf.loc[len(sitting_interestdf)] = {"interest_id": len(sitting_interestdf), "map_id": user_map_id, "sitting_id": sitting_id}

    # add events 
    eventdf = pd.DataFrame(columns=["event_id", "map_id", "event_name", "description" , "location", "startdate", "enddate",  "createdat"])

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
        random_map_id = random.choice(userdf["map_id"].tolist())
        name = random.choice(list(EVENTS.keys()))
        description = EVENTS[name]
        location = random.choice(ADDRESS)
        start_date = datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 30))
        end_date = start_date + datetime.timedelta(days=random.randint(1, 30))
        eventdf.loc[len(eventdf)] = {"event_id": len(eventdf), "map_id" :random_map_id, "Name": name, "Location": location, "StartDate": start_date, "EndDate": end_date, "Description": description}


    # add event interest 
    event_interestdf = pd.DataFrame(columns=["interest_id", "user_map_id", "event_id", "createdat" , "status"])

    for i in range(len(eventdf)):
        for j in range(INTEREST_COUNT):
            event_id = i
            user_map_id = random.choice(user_onlydf["map_id"].tolist())
            event_interestdf.loc[len(event_interestdf)] = {"interest_id": len(event_interestdf), "map_id": user_map_id, "event_id": event_id}

    # add adoption 
    adoptiondf = pd.DataFrame(columns=["adoption_id", "agency_map_id", "petid", "description", "status", "createdat", "updatedat"])
    ADOPTION_DESCRIPTIONS = [
    "Looking for a new home for this cute pet.",
    "Adopt this pet and give it a loving home.",
    "Adopt this pet and give it a forever home.",
    "Looking for a loving family for this pet.",
    "Looking for a new family for this pet.",
    ]

    for i in range(REQUEST_COUNT):
        random_map_id = random.choice(agencydf["map_id"].tolist())
        pet_id = random.randint(0, len(petdf))
        description = random.choice(ADOPTION_DESCRIPTIONS)
        status = random.choice(STATUS)
        adoptiondf.loc[len(adoptiondf)] = {"adoption_id": len(adoptiondf), "agency_map_id" :random_map_id, "petid": pet_id, "Description": description, "Status": status}

    # add adoption interest
    adoption_interestdf = pd.DataFrame(columns=["interest_id", "user_map_id", "adoption_id", "createdat" , "status"])
    
    for i in range(len(adoptiondf)):
        for j in range(INTEREST_COUNT):
            adoption_id = i
            user_map_id = random.choice(user_onlydf["map_id"].tolist())
            adoption_interestdf.loc[len(adoption_interestdf)] = {"interest_id": len(adoption_interestdf), "map_id": user_map_id, "adoption_id": adoption_id}

    userdf.to_csv(os.path.join(DIR ,"user.csv"))
    agencydf.to_csv(os.path.join(DIR ,"agency.csv"))
    petdf.to_csv(os.path.join(DIR ,"pet.csv"))
    sittingdf.to_csv(os.path.join(DIR ,"sitting.csv"))
    sitting_interestdf.to_csv(os.path.join(DIR ,"sitting_interest.csv"))
    eventdf.to_csv(os.path.join(DIR ,"event.csv"))
    event_interestdf.to_csv(os.path.join(DIR ,"event_interest.csv"))
    adoptiondf.to_csv(os.path.join(DIR ,"adoption.csv"))
    adoption_interestdf.to_csv(os.path.join(DIR ,"adoption_interest.csv"))




