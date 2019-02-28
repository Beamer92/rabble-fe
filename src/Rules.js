import React from 'react'

export default function Rules(props){
    return (
        <div id="rulesBar" className="sidebar rules metal linear">
        <h4>How to Play:</h4>
            <ul>
                <li>You are the <strong>Opportunity Rover</strong> with the Green Arrow</li>
                <li>Enemies are <strong>Grey Rovers</strong> with the first letter of their Username</li>
                <li>On the left, see Position for your place on the grid and the direction you're facing</li>
                <li>Your Green Arrow also shows the direction you're facing</li>
            </ul>
            <ul>
                <li>You get 5 commands per turn to give your Rover</li>
                <li>Use the <strong>'Left'</strong>,<strong>'Right'</strong>, and <strong>'Forward'</strong> buttons to queue commands</li>
                <li>You can Undo commands in the queue with the 'Undo' button</li>
                <li>Click 'Execute Instructions' to issue your commands to your Rover</li>
                <li>This will move your Rover and collect the letter at that location (if there is one)</li>
            </ul>
            <ul>
                <li>Careful not to go over the edge! You'll crash your Rover and lose your turn</li>
                <li>Letters get submitted in order, so spell out your word in order</li>
                <li>If you collect a letter you didn't want, click on it to drop it</li>
                <li>When you've spelled out a word, click 'Submit Rabble' to get your score!</li>
                <li>When everyone has submitted their word, the winner will be announced</li>
            </ul>
        </div>
    )
}