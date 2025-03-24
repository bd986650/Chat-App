export function scrollToBottom(container) {
    container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth' 
    });
}