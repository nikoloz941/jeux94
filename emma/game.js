// Initialisation du canvas et du contexte de dessin
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables du joueur
let player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: 'red',
    speed: 5,
    jumping: false,
    jumpPower: 10,
    gravity: 0.5,
    velocityY: 0
};

// Déplacement et défilement de la page
let scrollOffset = 0;

// Niveau de difficulté (1 = facile, 2 = moyen, 3 = difficile)
let difficultyLevel = 1;

// Définir les plateformes et obstacles selon la difficulté
let platforms = [];
let obstacles = [];
let pits = [
    { x: 300, y: 350, width: 50, height: 20, color: 'black' },
    { x: 500, y: 300, width: 50, height: 20, color: 'black' },
];
let enemies = [{ x: 600, y: 250, width: 50, height: 50, color: 'purple' }];
let movingPlatforms = [{ x: 200, y: 200, width: 100, height: 20, color: 'blue', direction: 1, speed: 2 }];

// Chronomètre
let timeElapsed = 0;
let gameRunning = true;

// Message défilant
let message = "Bouuuuuu Looser t'as eu peur bahahahahah mouhahahahahah (Non, t'as pas eu peur parce que je n'ai pas réussi à faire marcher le son 🐵🐵🐵🐵🤡🤡🤡🤡 (frère geutte la tete des emojis tu veux allez ou avec ca ) (de toute foçon je pref les systèmes et réseaux nsm le codage je suis ko mais trkl je suis entrain d'écouter une playlist de fou c'est la mienne)(j'ai ouvert je sais pas combien de parenthèse) ) bref, passons aux choses sérieuses... j'ai toujours pas digéré la defaite sur plato je te propose de le faire en IRL (je peux pas la semaines j'ai cours ni le weekend je taff torp relou trop relou type shite type shite dcp les vacc c'est good ) Oui je sais la demande est étrange en son genre, mais tu devrais savoir je suis différant (toujours aussi relou, let me cook (he thiks is a main character))(Adolescence, tu connais les risques, que du sale Seul devant Iblis, tant que Maman me dit mon fils t'es un homme J'étais sans réponse et puis le sang qui glisse sur mon visage C'est qu'le mal est fait mais ça m'a pas aidé d'écouter ma rage Ici, l'amour est dans, le bénéfice, des coeurs énormes Le bénéfice seul devant Iblis Mon fils t'es un homme L'enfer m'attend, vertu et vice mais j'veux des habits neufs Et puis l'paradis serait triste sans mes reufs (je viens de te faire chanter le refrain de Bénéfice aka le meilleur son de l'histoire de l'Humanité la balgue est un peu top longue) )  (Bref Oui ou NOn !";
let messagePosition = canvas.height;

// Screamer
let screamSound = new Audio('scary.mp3'); // Assurez-vous d'avoir le fichier audio dans le bon chemin
let screamImage = new Image();
screamImage.src = 'emma/img/bob.jpg'; // Chemin correct de l'image
let showScreamerImage = false; // Contrôle de l'affichage de l'image
let imageDisplayTime = 5000; // Temps d'affichage de l'image en millisecondes (5 secondes)


// Configuration du jeu selon la difficulté
function setupGameDifficulty() {
    if (difficultyLevel === 1) {
        platforms = [{ x: 100, y: 300, width: 150, height: 20, color: 'brown' }, { x: 400, y: 300, width: 150, height: 20, color: 'brown' }];
        obstacles = [];
    } else if (difficultyLevel === 2) {
        platforms = [{ x: 100, y: 300, width: 150, height: 20, color: 'brown' }, { x: 300, y: 250, width: 150, height: 20, color: 'brown' }, { x: 500, y: 200, width: 150, height: 20, color: 'brown' }];
        obstacles = [{ x: 400, y: 260, width: 50, height: 50, color: 'green' }];
    } else if (difficultyLevel === 3) {
        platforms = [
            { x: 50, y: 300, width: 100, height: 20, color: 'brown' },
            { x: 200, y: 250, width: 100, height: 20, color: 'brown' },
            { x: 350, y: 200, width: 100, height: 20, color: 'brown' },
            { x: 500, y: 150, width: 100, height: 20, color: 'brown' },
            { x: 650, y: 100, width: 100, height: 20, color: 'brown' },
        ];
        obstacles = [{ x: 300, y: 220, width: 50, height: 50, color: 'green' }, { x: 600, y: 120, width: 50, height: 50, color: 'green' }];
    }
}

// Dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dessiner les plateformes
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });
}

// Dessiner les trous
function drawPits() {
    pits.forEach(pit => {
        ctx.fillStyle = pit.color;
        ctx.fillRect(pit.x - scrollOffset, pit.y, pit.width, pit.height);
    });
}

// Dessiner les ennemis
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - scrollOffset, enemy.y, enemy.width, enemy.height);
    });
}

// Dessiner les plateformes mobiles
function drawMovingPlatforms() {
    movingPlatforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });
}

// Afficher le chronomètre
function drawTimer() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Temps écoulé : ' + Math.floor(timeElapsed) + 's', 10, 30);
}

// Afficher le message défilant
function drawMessage() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(message, messagePosition, canvas.height / 2);
}

// Gérer les touches pour les déplacements
let keys = {};

window.addEventListener('keydown', function (e) {
    keys[e.code] = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.code] = false;
});

// Mise à jour du jeu
function updateGame() {
    if (!gameRunning) return; // Si le jeu n'est pas en cours, ne pas mettre à jour

    // Mettre à jour le temps
    timeElapsed += 0.016; // 16 ms par frame (~60 FPS)

    if (keys['ArrowRight']) {
        player.x += player.speed;
        scrollOffset += player.speed;  // La caméra suit le joueur
    }
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
        scrollOffset -= player.speed;
    }

    if (keys['Space'] && !player.jumping) {
        player.jumping = true;
        player.velocityY = -player.jumpPower;
    }

    // Appliquer la gravité
    player.y += player.velocityY;
    player.velocityY += player.gravity;

    // Empêcher de tomber hors du sol
    if (player.y >= 300) {
        player.y = 300;
        player.jumping = false;
    }

    // Vérifier les collisions avec les plateformes
    platforms.forEach(platform => {
        if (player.x + player.width > platform.x - scrollOffset &&
            player.x < platform.x + platform.width - scrollOffset &&
            player.y + player.height < platform.y + platform.height &&
            player.y + player.height + player.velocityY >= platform.y) {
            player.y = platform.y - player.height;
            player.jumping = false;
        }
    });

    // Vérifier les collisions avec les obstacles
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width - scrollOffset &&
            player.x + player.width > obstacle.x - scrollOffset &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            endGame();  // Terminer le jeu si le joueur touche un obstacle
        }
    });

    // Vérifier les collisions avec les pits
    pits.forEach(pit => {
        if (player.x < pit.x + pit.width - scrollOffset &&
            player.x + player.width > pit.x - scrollOffset &&
            player.y + player.height > pit.y) {
            endGame();  // Terminer le jeu si le joueur tombe dans un trou
        }
    });

    // Vérifier les collisions avec les ennemis
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width - scrollOffset &&
            player.x + player.width > enemy.x - scrollOffset &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            endGame();  // Terminer le jeu si le joueur touche un ennemi
        }
    });

    // Vérifier les plateformes mobiles
    movingPlatforms.forEach(platform => {
        platform.x += platform.direction * platform.speed;
        if (platform.x <= 0 || platform.x + platform.width >= canvas.width) {
            platform.direction *= -1; // Inverser la direction
        }
    });

    // Si le joueur tombe en bas de l'écran, terminer le jeu
    if (player.y > canvas.height) {
        endGame();
    }
}

// Terminer le jeu
function endGame() {
    gameRunning = false; // Arrêter le jeu
    screamSound.play();  // Jouer le screamer
}

// Boucle principale du jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateGame();
    drawPlayer();
    drawPlatforms();
    drawPits();
    drawEnemies();
    drawMovingPlatforms();
    drawTimer();
    
    // Afficher le message défilant si le jeu est terminé
    if (!gameRunning) {
        drawMessage();
        messagePosition -= 2; // Défilement du message
        if (messagePosition < -ctx.measureText(message).width) {
            messagePosition = canvas.height; // Réinitialiser la position
        }
    }

    requestAnimationFrame(gameLoop);
}

// Initialiser le jeu
setupGameDifficulty();
gameLoop();
// Afficher l'image du screamer
function displayScreamer() {
    ctx.drawImage(screamImage, 0, 0, canvas.width, canvas.height); // Affiche l'image sur tout le canvas
}

// Terminer le jeu et afficher le screamer
function endGame() {
    gameRunning = false; // Arrêter le jeu
    screamSound.play();  // Jouer le screamer
    showScreamerImage = true; // Afficher l'image du screamer
    setTimeout(() => {
        showScreamerImage = false; // Cacher l'image après 5 secondes
        // Passer ensuite au message défilant après 5 secondes
        startScrollingMessage();
    }, imageDisplayTime);
}

// Boucle principale du jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameRunning) {
        updateGame();
        drawPlayer();
        drawPlatforms();
        drawPits();
        drawEnemies();
        drawMovingPlatforms();
        drawTimer();
    } else if (showScreamerImage) {
        displayScreamer(); // Afficher l'image si le screamer est actif
    } else {
        drawMessage(); // Afficher le message défilant si le screamer est terminé
        messagePosition -= 2; // Défilement du message
        if (messagePosition < -ctx.measureText(message).width) {
            messagePosition = canvas.height; // Réinitialiser la position
        }
    }

    requestAnimationFrame(gameLoop);
}
// Charger le son


// Jouer le son
function playScreamSound() {
    screamSound.play();
}

// Arrêter le son si nécessaire
function stopScreamSound() {
    screamSound.pause();
    screamSound.currentTime = 0; // Réinitialiser le son à 0 pour qu'il rejoue du début si nécessaire
}

// Exemple d'utilisation lors de la fin du jeu
function endGame() {
    gameRunning = false; // Arrêter le jeu
    playScreamSound();  // Jouer le son du screamer
    showScreamerImage = true; // Afficher l'image du screamer
    setTimeout(() => {
        showScreamerImage = false; // Cacher l'image après 5 secondes
        startScrollingMessage(); // Passer au message défilant
    }, imageDisplayTime);
}

