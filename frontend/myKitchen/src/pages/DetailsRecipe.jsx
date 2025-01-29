// import React, { useState, useEffect } from 'react';
// import Header from '../layout/header';
// import Footer from '../layout/footer';
// import { useParams } from 'react-router-dom';

// function DetailsRecipe() {
//     const { id } = useParams(); // ID aus URL holen
//     const [recipe, setRecipe] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetch(`http://localhost:8080/api/recipes/${id}`)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Fehler beim Laden des Rezepts');
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 setRecipe(data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 setError(error.message);
//                 setLoading(false);
//             });
//     }, [id]);

//     function handleDelete() {
//         fetch(`http://localhost:8080/api/recipes/${id}`, {
//             method: 'DELETE',
//         })
//             .then((response) => {
//                 if (response.ok) {
//                     window.location.href = '/';
//                 } else {
//                     alert('Fehler beim Löschen des Rezepts!');
//                 }
//             })
//             .catch((error) => {
//                 console.error('Fehler:', error);
//                 alert('Fehler beim Löschen des Rezepts!');
//             });
//     }

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     return (
//         <>
//             <Header />
//             <div className='content DetailBackground'>
//                 <div className='rd-img-container'>
//                     <img className='rd-img-inner' src={recipe.imageUrl} alt={recipe.name} />
//                 </div>
//                 <div>
//                     <div className='recipe-headline'>{recipe.name}</div>
//                     <div>von {recipe.publisher}</div>
//                 </div>
//                 <div className='recipe-description-container'>
//                     <div className="recipe-description-headline">Beschreibung: </div>
//                     <div className='recipe-description'>{recipe.description}</div>
//                 </div>
//                 <p><span className='hl-accente '>Zubereitungszeit:</span> {recipe.time} Minuten</p>
//                 <p><span className='hl-accente '>Kategorien: </span> {recipe.categories.join(', ')}</p>
//                 <p><span className='hl-accente '>Mahlzeit: </span> {recipe.mealtyp}</p>
//                 <p><span className='hl-accente '> Schwierigkeit: </span>{recipe.lvl}</p>
//                 <div className='flex-two '>
//                     <div className='flex-two-left-7'>
//                         <div className='recipe-subheadline'>
//                             Zubereitung
//                         </div>
//                         <ul>
//                             {recipe.steps.split(', ').map((steps, index) => (
//                                 <li className='steps-container' key={index}>
//                                     <div className='steps'>
//                                         Steps {index + 1}
//                                     </div>
//                                     <div>
//                                         {steps}
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                     <div className='flex-two-right-3'>
//                         <div className='recipe-subheadline'>Zutaten:</div>
//                         <div className='recipe-ingrediantlist'>
//                             <div className='ingrediants'>
//                                 <ul>
//                                     {recipe.ingredients.split(', ').map((ingredient, index) => (
//                                         <li className='ingredient-steps' key={index}>{ingredient}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div className='quantitys'>
//                                 <ul>
//                                     {recipe.quantity.split(', ').map((quantity, index) => (
//                                         <li className='ingredient-steps' key={index}>{quantity}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <p>Zubereitung:</p>
//                 <p>{recipe.steps}</p>
//             </div>
//             <Footer />
//         </>
//     );
// }

// export default DetailsRecipe;
import React, { useState, useEffect } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { useParams } from 'react-router-dom';

function DetailsRecipe() {
    const { id } = useParams(); // ID aus URL holen
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/recipes/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Fehler beim Laden des Rezepts');
                }
                return response.json();
            })
            .then((data) => {
                setRecipe(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    function handleDelete() {
        fetch(`http://localhost:8080/api/recipes/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Fehler beim Löschen des Rezepts!');
                }
            })
            .catch((error) => {
                console.error('Fehler:', error);
                alert('Fehler beim Löschen des Rezepts!');
            });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <Header />
            <div className='content DetailBackground'>
                <div className='rd-img-container'>
                    {/* //! Update the src attribute to use base64Image */}
                    <img
                        className='rd-img-inner'
                        src={`data:image/jpeg;base64,${recipe.base64Image}`} //! Construct the src using base64Image
                        alt={recipe.name}
                    />
                </div>
                <div>
                    <div className='recipe-headline'>{recipe.name}</div>
                    <div>von {recipe.publisher}</div>
                </div>
                <div className='recipe-description-container'>
                    <div className="recipe-description-headline">Beschreibung: </div>
                    <div className='recipe-description'>{recipe.description}</div>
                </div>
                <p><span className='hl-accente '>Zubereitungszeit:</span> {recipe.time} Minuten</p>
                <p><span className='hl-accente '>Kategorien: </span> {recipe.categories.join(', ')}</p>
                <p><span className='hl-accente '>Mahlzeit: </span> {recipe.mealtyp}</p>
                <p><span className='hl-accente '> Schwierigkeit: </span>{recipe.lvl}</p>
                <div className='flex-two '>
                    <div className='flex-two-left-7'>
                        <div className='recipe-subheadline'>
                            Zubereitung
                        </div>
                        <ul>
                            {recipe.steps.split(', ').map((steps, index) => (
                                <li className='steps-container' key={index}>
                                    <div className='steps'>
                                        Steps {index + 1}
                                    </div>
                                    <div>
                                        {steps}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='flex-two-right-3'>
                        <div className='recipe-subheadline'>Zutaten:</div>
                        <div className='recipe-ingrediantlist'>
                            <div className='ingrediants'>
                                <ul>
                                    {recipe.ingredients.split(', ').map((ingredient, index) => (
                                        <li className='ingredient-steps' key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className='quantitys'>
                                <ul>
                                    {recipe.quantity.split(', ').map((quantity, index) => (
                                        <li className='ingredient-steps' key={index}>{quantity}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <p>Zubereitung:</p>
                <p>{recipe.steps}</p>
            </div>
            <Footer />
        </>
    );
}

export default DetailsRecipe;