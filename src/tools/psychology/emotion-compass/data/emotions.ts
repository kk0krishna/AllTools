export interface EmotionNode {
  name: string;
  color?: string; // Hex color for this segment
  description?: string;
  children?: EmotionNode[];
}

export const emotionWheelData: EmotionNode = {
  name: "Emotions",
  children: [
    {
      name: "Bad",
      color: "#68c4af", // Teal Mint (from original)
      children: [
        {
          name: "Bored",
          children: [
            { name: "Indifferent", description: "Having no particular interest or sympathy; unconcerned." },
            { name: "Apathetic", description: "Showing or feeling no interest, enthusiasm, or concern." }
          ]
        },
        {
          name: "Busy",
          children: [
            { name: "Pressured", description: "Feeling forced or coerced into doing something." },
            { name: "Rushed", description: "Done or completed too hurriedly; hasty." }
          ]
        },
        {
          name: "Stressed",
          children: [
            { name: "Overwhelmed", description: "Buried or drowning beneath a huge mass." },
            { name: "Out of control", description: "Not under the direction or regulation of anyone." }
          ]
        },
        {
          name: "Tired",
          children: [
            { name: "Sleepy", description: "Ready to fall asleep." },
            { name: "Unfocused", description: "Not able to concentrate or focus." }
          ]
        }
      ]
    },
    {
      name: "Fearful",
      color: "#39a7c1", // Cerulean Blue (from original)
      children: [
        {
          name: "Scared",
          children: [
            { name: "Helpless", description: "Unable to defend oneself or to act without help." },
            { name: "Frightened", description: "Afraid or anxious." }
          ]
        },
        {
          name: "Anxious",
          children: [
            { name: "Overwhelmed", description: "Completely overcome or overpowered by thought or feeling." },
            { name: "Worried", description: "Anxious or troubled about actual or potential problems." }
          ]
        },
        {
          name: "Insecure",
          children: [
            { name: "Inadequate", description: "Lacking the quality or quantity required." },
            { name: "Inferior", description: "Lower in rank, status, or quality." }
          ]
        },
        {
          name: "Weak",
          children: [
            { name: "Worthless", description: "Having no real value or use." },
            { name: "Insignificant", description: "Too small or unimportant to be worth consideration." }
          ]
        },
        {
          name: "Rejected",
          children: [
            { name: "Excluded", description: "Denied access to a place, group, or privilege." },
            { name: "Persecuted", description: "Subjected to hostility and ill-treatment." }
          ]
        },
        {
          name: "Threatened",
          children: [
            { name: "Nervous", description: "Easily agitated or alarmed." },
            { name: "Exposed", description: "Not protected or covered." }
          ]
        }
      ]
    },
    {
      name: "Angry",
      color: "#9c75b7", // Lavender Purple (from original)
      children: [
        {
          name: "Let down",
          children: [
            { name: "Betrayed", description: "To have your trust broken." },
            { name: "Resentful", description: "Feeling or expressing bitterness or indignation." }
          ]
        },
        {
          name: "Humiliated",
          children: [
            { name: "Disrespected", description: "To show a lack of respect for." },
            { name: "Ridiculed", description: "Subjected to contemptuous and dismissive language or behavior." }
          ]
        },
        {
          name: "Bitter",
          children: [
            { name: "Indignant", description: "Feeling or showing anger or annoyance at what is perceived as unfair treatment." },
            { name: "Violated", description: "Treated with disrespect or abuse." }
          ]
        },
        {
          name: "Mad",
          children: [
            { name: "Furious", description: "Extremely angry." },
            { name: "Jealous", description: "Feeling or showing envy of someone or their achievements and advantages." }
          ]
        },
        {
          name: "Aggressive",
          children: [
            { name: "Provoked", description: "Stimulated to give rise to a reaction or emotion, typically a strong or unwelcome one." },
            { name: "Hostile", description: "Unfriendly; antagonistic." }
          ]
        },
        {
          name: "Frustrated",
          children: [
            { name: "Infuriated", description: "Made extremely angry and impatient." },
            { name: "Annoyed", description: "Slightly angry; irritated." }
          ]
        },
        {
          name: "Distant",
          children: [
            { name: "Withdrawn", description: "Not wanting to communicate with other people." },
            { name: "Numb", description: "Deprived of the power of sensation." }
          ]
        },
        {
          name: "Critical",
          children: [
            { name: "Skeptical", description: "Not easily convinced; having doubts or reservations." },
            { name: "Dismissive", description: "Feeling or showing that something is unworthy of consideration." }
          ]
        }
      ]
    },
    {
      name: "Disgusted",
      color: "#ab7274", // Dusty Rose (from original)
      children: [
        {
          name: "Disapproving",
          children: [
            { name: "Judgmental", description: "Having or displaying an excessively critical point of view." },
            { name: "Condemned", description: "Sentenced to a particular punishment, especially death." }
          ]
        },
        {
          name: "Disappointed",
          children: [
            { name: "Appalled", description: "Greatly dismayed or horrified." },
            { name: "Revolted", description: "To feel intense disgust." }
          ]
        },
        {
          name: "Awful",
          children: [
            { name: "Nauseated", description: "Make (someone) feel sick." },
            { name: "Detestable", description: "Deserving intense dislike." }
          ]
        },
        {
          name: "Repelled",
          children: [
            { name: "Horrified", description: "Filled with horror; extremely shocked." },
            { name: "Hesitant", description: "Tentative, unsure, or slow in acting or speaking." }
          ]
        }
      ]
    },
    {
      name: "Sad",
      color: "#ec8c74", // Salmon Coral (from original)
      children: [
        {
          name: "Hurt",
          children: [
            { name: "Embarrassed", description: "Feeling ashamed or self-conscious." },
            { name: "Disappointed", description: "Sad or displeased because someone or something has failed to fulfill one's hopes." }
          ]
        },
        {
          name: "Depressed",
          children: [
            { name: "Inferior", description: "Lower in rank, status, or quality." },
            { name: "Empty", description: "Containing nothing; not filled or occupied." }
          ]
        },
        {
          name: "Guilty",
          children: [
            { name: "Remorseful", description: "Filled with remorse; sorry." },
            { name: "Ashamed", description: "Embarrassed or guilty because of one's actions." }
          ]
        },
        {
          name: "Despair",
          children: [
            { name: "Grief", description: "Deep sorrow, especially that caused by someone's death." },
            { name: "Powerless", description: "Without ability, influence, or power." }
          ]
        },
        {
          name: "Vulnerable",
          children: [
            { name: "Victimized", description: "Singled out for cruel or unjust treatment." },
            { name: "Fragile", description: "Easily broken or damaged." }
          ]
        },
        {
          name: "Lonely",
          children: [
            { name: "Isolated", description: "Far away from other places, buildings, or people; remote." },
            { name: "Abandoned", description: "Having been deserted or cast off." }
          ]
        }
      ]
    },
    {
      name: "Happy",
      color: "#e76f51", // Terracotta (from original)
      children: [
        {
          name: "Optimistic",
          children: [
            { name: "Inspired", description: "Of extraordinary quality, as if arising from some external creative impulse." },
            { name: "Hopeful", description: "Feeling or inspiring optimism about a future event." }
          ]
        },
        {
          name: "Trusting",
          children: [
            { name: "Intimate", description: "Closely acquainted; familiar, close." },
            { name: "Sensitive", description: "Quick to detect or respond to slight changes, signals, or influences." }
          ]
        },
        {
          name: "Peaceful",
          children: [
            { name: "Thankful", description: "Pleased and relieved." },
            { name: "Loving", description: "Feeling or showing love or great care." }
          ]
        },
        {
          name: "Powerful",
          children: [
            { name: "Creative", description: "Relating to or involving the imagination or original ideas." },
            { name: "Courageous", description: "Not deterred by danger or pain; brave." }
          ]
        },
        {
          name: "Accepted",
          children: [
            { name: "Valued", description: "Considered to be important or beneficial; cherished." },
            { name: "Respected", description: "Deeply admired or esteemed." }
          ]
        },
        {
          name: "Proud",
          children: [
            { name: "Confident", description: "Feeling or showing confidence in oneself; self-assured." },
            { name: "Successful", description: "Accomplishing an aim or purpose." }
          ]
        },
        {
          name: "Interested",
          children: [
            { name: "Inquisitive", description: "Curious or inquiring." },
            { name: "Curious", description: "Eager to know or learn something." }
          ]
        },
        {
          name: "Content",
          children: [
            { name: "Joyful", description: "Feeling, expressing, or causing great pleasure and happiness." },
            { name: "Free", description: "Not under the control or in the power of another; able to act or be done as one wishes." }
          ]
        },
        {
          name: "Playful",
          children: [
            { name: "Cheeky", description: "Impudent or irreverent, typically in an endearing or amusing way." },
            { name: "Aroused", description: "Evoke or awaken (a feeling, emotion, or response)." }
          ]
        }
      ]
    },
    {
      name: "Surprised",
      color: "#f4a261", // Sunset Orange (from original)
      children: [
        {
          name: "Excited",
          children: [
            { name: "Energetic", description: "Showing or involving great activity or vitality." },
            { name: "Eager", description: "Wanting to do or have something very much." }
          ]
        },
        {
          name: "Amazed",
          children: [
            { name: "Awe", description: "A feeling of reverential respect mixed with fear or wonder." },
            { name: "Astonished", description: "Greatly surprised or impressed; amazed." }
          ]
        },
        {
          name: "Confused",
          children: [
            { name: "Perplexed", description: "Completely baffled; very puzzled." },
            { name: "Disillusioned", description: "Disappointed in someone or something that one discovers to be less good than one had believed." }
          ]
        },
        {
          name: "Startled",
          children: [
            { name: "Dismayed", description: "Cause (someone) to feel consternation and distress." },
            { name: "Shocked", description: "Experience a sudden upsetting or surprising event or experience." }
          ]
        }
      ]
    }
  ]
};
