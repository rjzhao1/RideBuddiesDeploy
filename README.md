# RideBuddies

[Live Demo](https://ride-buddies.herokuapp.com/)

# Features

---

-  Stack used: React.js, Node.js,Express,MongoDB
-  User can host a ride by providing information like Group Name, Seats, Destination, Pick location, Date and time.
-  Google Map API to display Ride destinations and to better help user search for rides
-  User Authorization and using Passport-JWT
-  Rides Index page where users can view and join all available rides
-  Ride Information card to view all information of a ride

---

## Landing Page

On the Landing Page, Users are freeted with a welcome message and are given some options to look for rides and view rides the are in.
I have implemented a Navbar that allows users to navigate to different pages using Links from react-routers.

![](screenshot/Dashboard.png)

## Google Maps API

Using Google Map API, I was able to display all the rides so that users could visually the ride destinations. I also use Google Map's geolocation fuction
to create a search bar so that Users could search for where they want to go and find if there is a ride available.

![](screenshot/map.png)

```
const PlacesAutocomplete  = props =>{
    const{
        ready,
        value,
        suggestions:{status,data},
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions:{
            location:{ lat:()=>37.774929,lng:()=>-122.419418},
            radius:200*1000,
        },
    });
    return (
        <div className='search'>
            <Combobox onSelect={ async (address)=>{
                setValue(address,false);
                clearSuggestions();

                try{
                    const results = await getGeocode({address});
                    const {lat, lng} = await getLatLng(results[0]);
                    props.panTo({lat,lng});
                }catch(err){
                    console.log(err);
                }

                }}>
                <ComboboxInput
                    value={value}
                    onChange={(e)=>{setValue(e.target.value);}}
                    disabled={!ready}
                    placeholder="Enter an address"
                    />
                    <ComboboxPopover>
                        <ComboboxList>
                        {status==="OK" && data.map(({id,description})=>(
                            <ComboboxOption key={id} value={description}/>
                        ))}
                       </ComboboxList>
                    </ComboboxPopover>
            </Combobox>
        </div>

    )
}
```

# Additional Information

[Database Schema](https://github.com/rjzhao1/RideBuddiesDeploy/wiki/Schema)
