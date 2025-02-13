import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/base.css';

function FormV2() {
    //User bekommen 
    const [username, setUsername] = useState('');
    const [imageBase64, setImageBase64] = useState(null);
    const [recipeId, setRecipeId] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('userToken');


            if (!token) {
                setError("token not found");
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    //const data = await response.json();
                    const text = await response.text();
                    if (text) {
                        const data = JSON.parse(text);
                        setUsername(data.username);
                    } else {
                        console.error("Leere antwort erhalten...")
                    }
                    //setUsername(data.username);
                } else {
                    console.error('Benutzerdaten konnten nicht geladen werden.');
                }
            } catch (error) {
                console.error('Fehler beim Laden der Benutzerdaten:', error);
            }
        };
        fetchUserData()
    }, []);

    //Navigierung nach dem Absenden 
    const navigate = useNavigate();

    // State to track the current step
    const [currentStep, setCurrentStep] = useState(1);

    // State to store form data for all steps
    const [formData, setFormData] = useState({
        image: null,
        name: '',
        description: '',
        lvl: '',
        mealtyp: '',
        time: '',
        categories: [],
        publics: false,
        ingredients: '',
        steps: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5242880) { // 5MB limit
                alert('Bild ist zu groß. Maximale Größe ist 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageBase64(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: null });
        }
    };

    // Handle input change for other fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle checkbox change for categories
    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;

        // Wenn die Checkbox ausgewählt wurde, füge den Wert zum categories-Array hinzu,
        // andernfalls entferne ihn
        setFormData(prevFormData => {
            const newCategories = checked
                ? [...prevFormData.categories, value]
                : prevFormData.categories.filter(category => category !== value);
            return { ...prevFormData, categories: newCategories };
        });
    };

    // Handle public toggle
    const handlePublicToggle = (e) => {
        setFormData({ ...formData, publics: e.target.checked });
    };

    // Function to go to the next step
    const nextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4)); // Assuming 4 steps
    };

    // Function to go to the previous step
    const prevStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Erstellen eines FormData Objekts für das Bild
        // const formDataToSend = new FormData();

        // // Bilddatei hinzufügen (falls vorhanden)
        // // if (formData.image) {
        // //     formDataToSend.append('image', formData.image);
        // // }
        // if (formData.image) {
        //     const uniqueFilename = `${Date.now()}_${formData.image.name}`;
        //     const uniqueFile = new File([formData.image], uniqueFilename, {
        //         type: formData.image.type
        //     });
        //     formDataToSend.append('image', uniqueFile);
        // }

        // Restliche Formulardaten als JSON hinzufügen
        const dataToSend = {
            name: formData.name,
            description: formData.description,
            lvl: formData.lvl,
            mealtyp: formData.mealtyp,
            time: formData.time,
            categories: formData.categories,
            publics: formData.publics,
            ingredients: formData.ingredients,
            steps: formData.steps,
            quantity: formData.quantity,
            publisher: username,
            base64Image: imageBase64  // This comes from the state we set in handleImageChange
        };
        // formDataToSend.append('data', JSON.stringify({
        //     name: formData.name,
        //     description: formData.description,
        //     lvl: formData.lvl,
        //     mealtyp: formData.mealtyp,
        //     time: formData.time,
        //     categories: formData.categories,
        //     publics: formData.publics,
        //     ingredients: formData.ingredients,
        //     steps: formData.steps,
        //     quantity: formData.quantity,
        //     publisher: username,
        // }));

        // console.log('Gesendete Daten:' + formDataToSend)

        // POST-Request an den Backend-Server
        fetch('http://localhost:8080/api/recipes', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json', 
            // },
            //body: formDataToSend
            headers: {
                //!!! Add Content-Type header for JSON
                'Content-Type': 'application/json',
            },
            //!!! Convert the object to JSON string
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Recipe saved:', data);
                navigate('/'); //Auf root zurück navigieren, wenn erfolgreich 
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Render the current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="relative h-full">
                        <div className='mb-6'>
                            <label htmlFor="imageUpload" className='block text-sm font-medium text-gray-700'></label>
                            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className='hidden' />

                            {/* Upload Box - Visible */}
                            <div className='cursor-pointer mt-4 w-[200px] h-[150px] border-2 border-dashed border-gold-500 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100' onClick={() => document.getElementById('imageUpload').click()}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className='w-full h-full object-cover' />
                                ) : (
                                    <span className='text-gray-500 text-center'>Klicken und Bild <br /> hochladen</span>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div className='flex flex-col mb-4'>
                            <label className='pb-2' htmlFor="name"> Rezeptname*</label>
                            <input
                                className='block border border-gold-500 focus:border focus:border-gold-700 rounded-md h-8'
                                type="text"
                                id="name"
                                name='name'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Beschreibung */}
                        <div className='mb-3'>
                            <label className='pb-2' htmlFor="description"> Beschreibung*</label>
                            <textarea
                                className='mt-2 w-full h-32 block border border-gold-500 focus:border focus:border-gold-700 rounded-md'
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className='absolute bottom-4 right-6'>
                            <a onClick={nextStep} className="button text-[#FFF] bg-gold-300 font-medium rounded-lg text-sm px-3 py-2">Weiter</a>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="relative h-full">
                        <div className='grid grid-cols-2 gap-5 mb-3'>
                            <div>
                                {/* Schwierigkeit */}
                                <div className='flex flex-col col-span-3 mb-4'>
                                    <label className='pb-2' htmlFor="lvl"> Aufwand </label>
                                    <select
                                        className='block border border-gold-500 focus:border focus:border-gold-700 rounded-md h-8'
                                        id="lvl"
                                        name='lvl'
                                        value={formData.lvl}
                                        onChange={handleInputChange}
                                    >
                                        <option value="none"></option>
                                        <option value="leicht">leicht</option>
                                        <option value="mittel">mittel</option>
                                        <option value="schwer">schwer</option>
                                    </select>
                                </div>

                                {/* Tagesmahlzeiten */}
                                <div className='flex flex-col mb-4'>
                                    <label className='pb-2' htmlFor="mealtyp"> Tagesmahlzeiten </label>
                                    <select
                                        className='block border border-gold-500 focus:border focus:border-gold-700 rounded-md h-8'
                                        id="mealtyp"
                                        name='mealtyp'
                                        value={formData.mealtyp}
                                        onChange={handleInputChange}
                                    >
                                        <option value="none"></option>
                                        <option value="fruehstueck">Frühstück</option>
                                        <option value="mittag">Mittagessen</option>
                                        <option value="abend">Abendessen</option>
                                        <option value="deser">Dessert</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>

                                {/* Dauer */}
                                <div className='flex flex-col col-span-3 mb-4'>
                                    <label className='pb-2' htmlFor="time"> Dauer</label>
                                    <input
                                        className='block border border-gold-500 focus:border focus:border-gold-700 rounded-md h-8'
                                        type="text"
                                        id="time"
                                        name='time'
                                        value={formData.time}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Kategorie */}
                                <div className='flex flex-col mb-4'>
                                    <div className='pb-2'> Kategorien</div>
                                    <ul className="grid w-full gap-6 md:grid-cols-3">
                                        <li>
                                            <input type="checkbox" id="vegan" value="vegan" className="hidden peer" onChange={handleCategoryChange} />
                                            <label htmlFor="vegan" className="inline-flex items-center justify-between w-full h-8 text-gray-500 bg-white border-2 border-gold-500 rounded-lg cursor-pointer peer-checked:border-gold-700 peer-checked:bg-gold-700 peer-checked:text-white">
                                                <div className="block text-sm mx-auto">
                                                    Vegan
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input type="checkbox" id="vegetarisch" value="vegetarisch" className="hidden peer" onChange={handleCategoryChange} />
                                            <label htmlFor="vegetarisch" className="inline-flex items-center justify-between w-full h-8 text-gray-500 bg-white border-2 border-gold-500 rounded-lg cursor-pointer peer-checked:border-gold-700 peer-checked:bg-gold-700 peer-checked:text-white">
                                                <div className="block text-sm mx-auto">
                                                    Vegetarisch
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input type="checkbox" id="Vollkost" value="Vollkost" className="hidden peer" onChange={handleCategoryChange} />
                                            <label htmlFor="Vollkost" className="inline-flex items-center justify-between w-full h-8 text-gray-500 bg-white border-2 border-gold-500 rounded-lg cursor-pointer peer-checked:border-gold-700 peer-checked:bg-gold-700 peer-checked:text-white">
                                                <div className="block text-sm mx-auto">
                                                    Vollkost
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input type="checkbox" id="glutenfrei" value="glutenfrei" className="hidden peer" onChange={handleCategoryChange} />
                                            <label htmlFor="glutenfrei" className="inline-flex items-center justify-between w-full h-8 text-gray-500 bg-white border-2 border-gold-500 rounded-lg cursor-pointer peer-checked:border-gold-700 peer-checked:bg-gold-700 peer-checked:text-white">
                                                <div className="block text-sm mx-auto">
                                                    Gluten-frei
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input type="checkbox" id="low-carb" value="low-carb" className="hidden peer" onChange={handleCategoryChange} />
                                            <label htmlFor="low-carb" className="inline-flex items-center justify-between w-full h-8 text-gray-500 bg-white border-2 border-gold-500 rounded-lg cursor-pointer peer-checked:border-gold-700 peer-checked:bg-gold-700 peer-checked:text-white">
                                                <div className="block text-sm mx-auto">
                                                    Low-Carb
                                                </div>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Öffentliches Rezept */}
                            <div className='mb-4'>
                                <label className="items-center me-5 cursor-pointer">
                                    <label className='' htmlFor="publics">Auf öffentlich stellen</label>
                                    <input type="checkbox" value="publics" id='publics' name='publics' checked={formData.publics} onChange={handlePublicToggle} className="sr-only peer" />
                                    <div className="mt-3 peer-checked:bg-gold-400 dark:bg-gold-200 peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                                </label>
                            </div>
                        </div>

                        <div className='absolute bottom-4 right-[6.5rem]'>
                            <a onClick={prevStep} className="button text-[#FFF] bg-gold-200 font-medium rounded-lg text-sm px-3 py-2">Zurück</a>
                        </div>
                        <div className='absolute bottom-4 right-6'>
                            <a onClick={nextStep} className="button text-[#FFF] bg-gold-300 font-medium rounded-lg text-sm px-3 py-2">Weiter</a>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="relative h-full">
                        <div className='grid grid-cols-3 gap-5 mb-3'>
                            {/* Qunatity */}
                            <div className='mb-4 col-span-1'>
                                <label className='pb-2' htmlFor="ingredients"> Menge* </label>
                                <textarea
                                    placeholder='Bitte trenne die einzelnen Punkte mit einem Semikolon ( ; ), außer den letzten Eintrag.'
                                    className='mt-2 w-full h-64 block border border-gold-500 focus:border focus:border-gold-700 rounded-md'
                                    name="quantity"
                                    id="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            {/* Ingrediants */}
                            <div className='mb-4 col-span-2'>
                                <label className='pb-2' htmlFor="ingredients"> Zutaten* </label>
                                <textarea
                                    placeholder='Bitte trenne die einzelnen Punkte mit einem Semikolon ( ; ), außer den letzten Eintrag.'
                                    className='mt-2 w-full h-64 block border border-gold-500 focus:border focus:border-gold-700 rounded-md'
                                    name="ingredients"
                                    id="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className='absolute bottom-4 right-[6.5rem]'>
                            <a onClick={prevStep} className="button text-[#FFF] bg-gold-200 font-medium rounded-lg text-sm px-3 py-2">Zurück</a>
                        </div>
                        <div className='absolute bottom-4 right-6'>
                            <a onClick={nextStep} className="button text-[#FFF] bg-gold-300 font-medium rounded-lg text-sm px-3 py-2">Weiter</a>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="relative h-full">
                        <div className='mb-4'>
                            <label className='pb-2' htmlFor="steps"> Zubereitungsschritte* </label>
                            <textarea
                                placeholder='Bitte trenne die einzelnen Punkte mit einem Semikolon ( ; ), außer den letzten Eintrag.'
                                className='mt-2 w-full h-64 block border border-gold-500 focus:border focus:border-gold-700 rounded-md'
                                name="steps"
                                id="steps"
                                value={formData.steps}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className='absolute bottom-4 right-[6.5rem]'>
                            <a onClick={prevStep} className="button text-[#FFF] bg-gold-200 font-medium rounded-lg text-sm px-3 py-2">Zurück</a>
                        </div>
                        <div className='absolute bottom-4 right-6'>
                            <button type="submit" className="text-[#FFF] bg-gold-300 font-medium rounded-lg text-sm px-3 py-2">Senden</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='flex max-w-5xl mx-auto shadow-xl font-Roboto'>
            {/* Navigation */}
            <div className='w-[30%] h-[600px] bg-gold-600 rounded-tl-3xl rounded-bl-3xl'>
                <div className='text-white flex justify-center place-items-center items-center h-full'>
                    <ul className='flex flex-col gap-6'>
                        <li>
                            <div className={currentStep === 1 ? 'font-bold' : ''}>Allgemein</div>
                        </li>
                        <li>
                            <div className={currentStep === 2 ? 'font-bold' : ''}>Spezifikationen</div>
                        </li>
                        <li>
                            <div className={currentStep === 3 ? 'font-bold' : ''}>Zutaten</div>
                        </li>
                        <li>
                            <div className={currentStep === 4 ? 'font-bold' : ''}>Schritte</div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Multi-Formular */}
            <div className='w-[70%] h-[600px] bg-white rounded-tr-3xl rounded-br-3xl relative'>
                <form className='p-10 h-full' method="POST" action="/store-rezept" encType="multipart/form-data" onSubmit={handleSubmit}>
                    {renderStep()}
                </form>
            </div>
        </div>
    );
}

export default FormV2;